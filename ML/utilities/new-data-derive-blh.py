from pathlib import Path
import pandas as pd
import numpy as np
import re

# ============================================================
# 1. Paths (same structure as your project)
# ============================================================
BASE_DIR = Path(".").resolve()
DATA_DIR  = BASE_DIR / "Data_SIH_2025_with_blh"

print("BASE_DIR:", BASE_DIR)
print("DATA_DIR:", DATA_DIR)

# (We WILL NOT merge coords, just showing how to load them if needed later)
coords_path = DATA_DIR / "lat_lon_sites.txt"
print("coords file (for later use only):", coords_path)

# ============================================================
# 2. Load and combine all site_*_training_data.csv
# ============================================================
site_files = sorted(DATA_DIR.glob("site_*_train_data.csv"))
print(f"Found {len(site_files)} site files.")
if not site_files:
    raise FileNotFoundError("No site_*_train_data.csv found in DATA_DIR")

frames = []
for path in site_files:
    m = re.search(r"site_(\d+)_train_data\.csv", path.name)
    if not m:
        print("Skipping unexpected filename:", path.name)
        continue

    site_id = int(m.group(1))
    df_site = pd.read_csv(path)

    # Ensure 'site' column exists and is consistent
    if "site" not in df_site.columns:
        df_site["site"] = site_id
    else:
        # in case it's float/string, force int
        df_site["site"] = df_site["site"].astype(int)

    frames.append(df_site)

df = pd.concat(frames, ignore_index=True)
print("Combined shape:", df.shape)
print("Columns:", df.columns.tolist())

# ============================================================
# 3. Build datetime & sort (NO coords merged)
# ============================================================
df["datetime"] = pd.to_datetime(
    df[["year", "month", "day", "hour"]].rename(
        columns={"year": "year", "month": "month", "day": "day", "hour": "hour"}
    )
)

df = df.sort_values(["site", "datetime"]).reset_index(drop=True)
print("Sample after datetime + sort:")
print(df.head())

# ============================================================
# 4. Feature engineering helpers (no lat/lon used)
# ============================================================
def add_time_features(df):
    dt = df["datetime"]
    df["hour_sin"] = np.sin(2 * np.pi * dt.dt.hour / 24)
    df["hour_cos"] = np.cos(2 * np.pi * dt.dt.hour / 24)

    df["dow"] = dt.dt.dayofweek
    df["dow_sin"] = np.sin(2 * np.pi * df["dow"] / 7)
    df["dow_cos"] = np.cos(2 * np.pi * df["dow"] / 7)

    df["month_sin"] = np.sin(2 * np.pi * dt.dt.month / 12)
    df["month_cos"] = np.cos(2 * np.pi * dt.dt.month / 12)

    df["is_weekend"] = (df["dow"] >= 5).astype(int)
    return df


def add_wind_features(df):
    u = df["u_forecast"]
    v = df["v_forecast"]
    df["wind_speed"]   = np.sqrt(u**2 + v**2)
    df["wind_dir_rad"] = np.arctan2(v, u)

    df["blh_log"]   = np.log1p(df["blh_forecast"])
    df["w_over_blh"] = df["w_forecast"] / (df["blh_forecast"] + 1e-3)
    return df


def add_ratio_features(df):
    df["O3_NO2_forecast_ratio"] = df["O3_forecast"] / (df["NO2_forecast"] + 1e-3)
    df["NO2_HCHO_sat_ratio"]    = df["NO2_satellite"] / (df["HCHO_satellite"] + 1e-3)
    df["NOx_satellite_proxy"]   = df["NO2_satellite"] + df["HCHO_satellite"]

    df["O3_forecast_blh"]  = df["O3_forecast"]  * df["blh_forecast"]
    df["NO2_forecast_blh"] = df["NO2_forecast"] * df["blh_forecast"]
    return df


def add_lagged_features(df, group_cols, target_cols, lag_hours=(1, 2, 3, 6, 12, 24)):
    """
    Lags use only past data (shift) -> no leakage.
    """
    df = df.copy()
    groups = df.groupby(group_cols) if group_cols else [(None, df)]

    frames = []
    for _, sub in groups:
        sub = sub.sort_values("datetime")
        for col in target_cols:
            for lag in lag_hours:
                sub[f"{col}_lag_{lag}h"] = sub[col].shift(lag)
        frames.append(sub)

    out = pd.concat(frames, axis=0).sort_values(["site", "datetime"]).reset_index(drop=True)
    return out


def add_rolling_features(df, group_cols, cols, windows=(3, 6, 12, 24)):
    """
    Rolling mean/std shifted by 1 -> only past window used.
    """
    df = df.copy()
    groups = df.groupby(group_cols) if group_cols else [(None, df)]

    frames = []
    for _, sub in groups:
        sub = sub.sort_values("datetime")
        for col in cols:
            for w in windows:
                rm = sub[col].rolling(window=w, min_periods=1).mean().shift(1)
                rs = sub[col].rolling(window=w, min_periods=1).std().shift(1)
                sub[f"{col}_rollmean_{w}h"] = rm
                sub[f"{col}_rollstd_{w}h"]  = rs
        frames.append(sub)

    out = pd.concat(frames, axis=0).sort_values(["site", "datetime"]).reset_index(drop=True)
    return out

# ============================================================
# 5. Apply feature engineering
# ============================================================
print("Adding time features...")
df = add_time_features(df)

print("Adding wind/BLH features...")
df = add_wind_features(df)

print("Adding ratio / chemistry features...")
df = add_ratio_features(df)

print("Adding lagged target features (by site)...")
df = add_lagged_features(
    df,
    group_cols=["site"],
    target_cols=["O3_target", "NO2_target"],
    lag_hours=(1, 2, 3, 6, 12, 24),
)

print("Adding rolling statistics (by site)...")
df = add_rolling_features(
    df,
    group_cols=["site"],
    cols=["O3_target", "NO2_target", "O3_forecast", "NO2_forecast"],
    windows=(3, 6, 12, 24),
)

before = len(df)
df = df.dropna().reset_index(drop=True)
after = len(df)
print(f"Rows before NA drop: {before} | after: {after} | dropped: {before - after}")

# ============================================================
# 6. Save engineered dataset (NO coords inside)
# ============================================================
ENGINEERED_DATA_PATH = DATA_DIR / "train_dataset_engineered-blh.csv"

if ENGINEERED_DATA_PATH.exists():
    print("WARNING: Overwriting existing file:", ENGINEERED_DATA_PATH)

df.to_csv(ENGINEERED_DATA_PATH, index=False)
print("Saved engineered dataset to:", ENGINEERED_DATA_PATH)

df.head()
