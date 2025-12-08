import pandas as pd
from pathlib import Path

# =========================
# CONFIG
# =========================
BASE_DIR = Path("ML")
ERA5_PATH = BASE_DIR / "Data_SIH_2025 2" / "era5_station_timeseries.csv"
SITE_DIR = BASE_DIR / "Data_SIH_2025_with_blh"
OUTPUT_PATH = BASE_DIR / "Data_SIH_2025_with_blh" / "era5_station_timeseries_with_blh-forecast.csv"

# =========================
# 1. LOAD ERA5 STATION DATA
# =========================
era5 = pd.read_csv(ERA5_PATH)
era5["datetime"] = pd.to_datetime(era5["datetime"])

print("Original ERA5 shape:", era5.shape)
print("Unique site values in ERA5:", era5["site"].unique())

required_era5_cols = {"site", "datetime", "era5_blh"}
missing_era5 = required_era5_cols - set(era5.columns)
if missing_era5:
    raise ValueError(f"Missing columns in era5_station_timeseries.csv: {missing_era5}")

# =========================
# 2. HELPER TO FIND MATCHING SITE VALUE
# =========================
def find_site_value_for_index(i: int, era5_sites: pd.Series):
    """
    Try to find what 'site' value in ERA5 corresponds to site_{i}_train_data.csv.
    We try a few common patterns and return the first that exists.
    """
    candidates = [
        i,                         # numeric 1, 2, ...
        str(i),                    # "1", "2", ...
        f"site_{i}",               # "site_1", ...
        f"SITE_{i}",               # "SITE_1", ...
    ]

    for val in candidates:
        if (era5_sites == val).any():
            print(f"  Mapped logical site_{i} to ERA5 site value {val!r}")
            return val

    print(f"  WARNING: Could not find any ERA5 'site' matching site index {i} (tried {candidates})")
    return None

# =========================
# 3. MERGE PER SITE WITH blh_forecast
# =========================
all_sites_merged = []
era5_sites_series = era5["site"]

for i in range(1, 8):  # logical site indices 1..7
    site_name = f"site_{i}"
    train_path = SITE_DIR / f"{site_name}_train_data.csv"
    print(f"\nProcessing {site_name} from {train_path}")

    # Determine real site value in ERA5 for this index
    site_val = find_site_value_for_index(i, era5_sites_series)
    if site_val is None:
        print(f"  Skipping {site_name} because no matching ERA5 'site' value was found.")
        continue

    # ---- load train data ----
    site_df = pd.read_csv(train_path)

    required_site_cols = {"year", "month", "day", "hour", "blh_forecast"}
    missing_site = required_site_cols - set(site_df.columns)
    if missing_site:
        raise ValueError(
            f"Missing columns in {train_path}: {missing_site}. "
            f"Found columns: {list(site_df.columns)}"
        )

    # ---- build datetime from year, month, day, hour ----
    site_df["datetime"] = pd.to_datetime(
        dict(
            year=site_df["year"],
            month=site_df["month"],
            day=site_df["day"],
            hour=site_df["hour"],
        )
    )

    # ---- set site column to the ERA5 'site' value we detected ----
    site_df["site"] = site_val

    # ---- keep only columns needed for merge ----
    site_merge = site_df[["site", "datetime", "blh_forecast"]].copy()

    # ---- filter ERA5 to this site ----
    era5_site = era5[era5["site"] == site_val].copy()
    print(f"  ERA5 rows for site value {site_val!r}: {era5_site.shape[0]}")
    print(f"  Train rows for {site_name}: {site_merge.shape[0]}")

    # ---- inner join on (site, datetime) ----
    merged_site = era5_site.merge(
        site_merge,
        on=["site", "datetime"],
        how="inner",
    )

    print(f"  Merged rows for site value {site_val!r}: {merged_site.shape[0]}")
    if not merged_site.empty:
        print(
            f"  Datetime range in merged: "
            f"{merged_site['datetime'].min()} -> {merged_site['datetime'].max()}"
        )

    all_sites_merged.append(merged_site)

# =========================
# 4. CONCAT ALL SITES & SAVE
# =========================
if all_sites_merged:
    final_df = pd.concat(all_sites_merged, ignore_index=True)
    final_df = final_df.sort_values(["site", "datetime"]).reset_index(drop=True)
else:
    final_df = pd.DataFrame(columns=list(era5.columns) + ["blh_forecast"])

print("\nFinal merged shape (all sites):", final_df.shape)

final_df.to_csv(OUTPUT_PATH, index=False)
print(f"Saved merged file with blh_forecast to: {OUTPUT_PATH}")
