"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/eden";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, RefreshCw, MapPin, CalendarClock, Wind } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface AqiData {
  historical_timestamps: string[];
  forecast_timestamps: string[];
  forecast_O3_target: number[];
  forecast_NO2_target: number[];
  historical_O3_target: number[];
  historical_NO2_target: number[];
}

export default function AqiDashboard() {
  const [sites, setSites] = useState<
    Record<string, { latitude: number; longitude: number }>
  >({});
  const [selectedSite, setSelectedSite] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any[]>([]);
  const [forecastLimit, setForecastLimit] = useState(48);
  const [hoveredData, setHoveredData] = useState<any>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchSites = async () => {
      const { data, error } = await api.api.aqi.sites.get();
      if (data && !error) {
        // @ts-ignore
        setSites(data);
        // @ts-ignore
        const siteIds = Object.keys(data);
        if (siteIds.length > 0) setSelectedSite(siteIds[0]);
      }
    };
    fetchSites();
  }, []);

  const runForecast = async () => {
    if (!selectedSite) return;
    setLoading(true);

    try {
      const sampleRes = await fetch("/api/aqi/sample-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_id: selectedSite }),
      });
      const sampleJson = await sampleRes.json();

      if (!sampleRes.ok || !sampleJson.data) {
        console.error("Failed to load sample data", sampleJson);
        return;
      }

      const inputData = sampleJson.data;

      const { data, error } = await api.api.aqi.forecast.timeseries.post({
        site_id: selectedSite,
        data: inputData,
        historical_points: 72,
      });

      if (data && !error) {
        const response = data as unknown as AqiData;
        if ("error" in response) {
          console.error("Server returned error:", (response as any).error);
          return;
        }

        if (
          !response.historical_timestamps ||
          !Array.isArray(response.historical_timestamps)
        ) {
          console.error("Invalid response format:", response);
          return;
        }

        const mergedData: any[] = [];

        const hasServerHistory =
          response.historical_O3_target &&
          response.historical_O3_target.length > 0;

        const historyLength = response.historical_timestamps.length;
        const relevantInputData = inputData.slice(-historyLength);

        response.historical_timestamps.forEach((ts, idx) => {
          let o3Val = response.historical_O3_target?.[idx];
          let no2Val = response.historical_NO2_target?.[idx];

          if (
            (o3Val === undefined || o3Val === null) &&
            relevantInputData[idx]
          ) {
            o3Val = relevantInputData[idx].O3_forecast;
          }
          if (
            (no2Val === undefined || no2Val === null) &&
            relevantInputData[idx]
          ) {
            no2Val = relevantInputData[idx].NO2_forecast;
          }

          mergedData.push({
            timestamp: new Date(ts).toLocaleString(),
            rawTimestamp: new Date(ts).getTime(),
            type: "Historical",
            O3: o3Val,
            NO2: no2Val,
            isForecast: false,
          });
        });

        if (
          response.forecast_timestamps &&
          Array.isArray(response.forecast_timestamps)
        ) {
          response.forecast_timestamps.forEach((ts, idx) => {
            mergedData.push({
              timestamp: new Date(ts).toLocaleString(),
              rawTimestamp: new Date(ts).getTime(),
              type: "Forecast",
              O3_Forecast: response.forecast_O3_target?.[idx],
              NO2_Forecast: response.forecast_NO2_target?.[idx],
              isForecast: true,
            });
          });
        }

        setChartData(mergedData);
      }
    } catch (e) {
      console.error("Forecast error", e);
    } finally {
      setLoading(false);
    }
  };

  const historicalData = useMemo(() => {
    return chartData.filter((d) => !d.isForecast);
  }, [chartData]);

  const forecastData = useMemo(() => {
    if (chartData.length === 0) return [];
    const forecast = chartData.filter((d) => d.isForecast);

    return forecast.slice(0, forecastLimit);
  }, [chartData, forecastLimit]);

  const handleMouseMove = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setHoveredData(state.activePayload[0].payload);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60">
        <div className="flex-1">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Air Quality Forecast
          </h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">
            AI-driven predictions for Ozone and NO2 levels across monitoring
            sites
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap min-w-fit">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300">
            <MapPin className="w-4 h-4 text-teal-600" />
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="border-0 text-slate-700 font-semibold text-sm h-auto p-0">
                <SelectValue placeholder="Choose location" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(sites).map((site) => (
                  <SelectItem key={site} value={site}>
                    {site}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={runForecast}
            disabled={loading || !selectedSite}
            className="bg-linear-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white font-semibold px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {loading ? "Running..." : "Forecast"}
          </Button>
        </div>
      </div>
 <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5" />
                Forecast Horizon
            </CardTitle>
            <CardDescription>Adjust the time range for the forecast visualization (Next {forecastLimit} Hours)</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium w-12">1h</span>
                <Slider 
                    defaultValue={[48]} 
                    max={48} 
                    min={1} 
                    step={1} 
                    value={[forecastLimit]}
                    onValueChange={(vals) => setForecastLimit(vals[0])}
                    className="flex-1"
                />
                <span className="text-sm font-medium w-12">48h</span>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph 1: Forecasted Ozone (O3) */}
        <Card className="border border-slate-700 bg-slate-900 shadow-2xl hover:shadow-slate-950/50 transition-all duration-300 rounded-lg overflow-hidden">
          <CardHeader className="pb-4 bg-linear-to-r from-slate-900 to-slate-900/50 border-b border-slate-700/30">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <div className="w-3 h-3 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/50"></div>
              <span className="text-cyan-300">O3 Forecast</span>
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2 text-xs font-normal">
              Ozone Level Prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-900/50">
            <div
              className="h-[350px] w-full"
              style={{ height: 350, width: "100%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} onMouseMove={handleMouseMove}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis className="text-xs" stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="O3_Forecast"
                    stroke="#06b6d4"
                    name="Forecast O3"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graph 2: Forecasted Nitrogen Dioxide (NO2) */}
        <Card className="border border-slate-700 bg-slate-900 shadow-2xl hover:shadow-slate-950/50 transition-all duration-300 rounded-lg overflow-hidden">
          <CardHeader className="pb-4 bg-linear-to-r from-slate-900 to-slate-900/50 border-b border-slate-700/30">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50"></div>
              <span className="text-amber-300">NO2 Forecast</span>
            </CardTitle>
            <CardDescription className="text-slate-400 mt-2 text-xs font-normal">
              Nitrogen Dioxide Level Prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-slate-900/50">
            <div
              className="h-[350px] w-full"
              style={{ height: 350, width: "100%" }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData} onMouseMove={handleMouseMove}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis className="text-xs" stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--popover-foreground))",
                    }}
                    itemStyle={{ color: "hsl(var(--popover-foreground))" }}
                    labelStyle={{ color: "hsl(var(--popover-foreground))" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="NO2_Forecast"
                    stroke="#f59e0b"
                    name="Forecast NO2"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300 rounded-lg overflow-hidden">
        <CardHeader className="pb-3 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <div className="p-1.5 bg-emerald-100 rounded-md">
              <CalendarClock className="w-4 h-4 text-emerald-600" />
            </div>
            Forecast Details
          </CardTitle>
          <CardDescription className="text-slate-500 mt-1 text-xs">
            {hoveredData
              ? "Forecast parameters at selected time"
              : "Hover over charts for detailed metrics"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-3">
          {hoveredData ? (
            <div className="space-y-3">
              <p className="text-sm">
                On{" "}
                <span className="font-semibold text-foreground">
                  {hoveredData.timestamp}
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hoveredData.O3_Forecast !== undefined && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Ozone (O3)
                      </p>
                      <p className="text-lg font-bold">
                        {hoveredData.O3_Forecast.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          µg/m³
                        </span>
                      </p>
                    </div>
                  </div>
                )}
                {hoveredData.NO2_Forecast !== undefined && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Nitrogen Dioxide (NO2)
                      </p>
                      <p className="text-lg font-bold">
                        {hoveredData.NO2_Forecast.toFixed(2)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          µg/m³
                        </span>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-[120px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
              Move your cursor over the graphs to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
