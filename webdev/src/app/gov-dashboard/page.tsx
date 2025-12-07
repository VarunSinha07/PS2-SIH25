import { prismaGov } from "@/lib/db/gov";
import { sendAlert } from "./actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AqiDashboard from "@/components/dashboard/aqi-dashboard";
import {
  AlertTriangle,
  CheckCircle,
  Send,
  LayoutDashboard,
  History,
  Activity,
  Wind,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MONITORING_SITES, getSiteName } from "@/lib/sites";
import { calculatePollutionScore } from "@/lib/aqi-utils";

// Force dynamic rendering to prevent build-time database access
export const dynamic = 'force-dynamic';

// Mock data generator for critical regions if DB is empty
const getCriticalRegions = (reports: any[]) => {
  if (reports.length > 0) {
    return reports.filter((r: any) => r.aqi > 200);
  }
  // Fallback mock data for demonstration using real sites
  // Using O3 and NO2 values to demonstrate the scoring logic
  const mockData = [
    {
      id: "mock-1",
      region: "site_1", // GT Karnal Road
      o3: 120, // Moderate
      no2: 300, // Very Poor -> Severe Category
      recordedAt: new Date(),
      forecast: "Rising",
    },
    {
      id: "mock-2",
      region: "site_4", // Narela
      o3: 180, // Poor -> High Category
      no2: 150, // Moderate
      recordedAt: new Date(),
      forecast: "Stable",
    },
    {
      id: "mock-3",
      region: "site_6", // Rohini
      o3: 60, // Satisfactory -> Low
      no2: 50, // Satisfactory -> Low
      recordedAt: new Date(),
      forecast: "Falling",
    },
  ];

  return mockData
    .map((d) => {
      const score = calculatePollutionScore(d.o3, d.no2);
      return {
        ...d,
        aqi: score.score, // Using max concentration as proxy for AQI display
        pollutant: score.dominantPollutant,
        category: score.category,
        fullCategory: score.fullCategory,
        details: score.details,
      };
    })
    .filter((d) => d.category === "High" || d.category === "Severe"); // Only show High/Severe
};

export default async function GovDashboard() {
  const alerts = await prismaGov.alert.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
  const recentAlerts = await prismaGov.alert.findMany({
    where: {
      createdAt: {
        gte: twelveHoursAgo,
      },
    },
  });

  const alertedRegions = new Set(
    recentAlerts.map((a) => a.region).filter(Boolean)
  );

  const reports = await prismaGov.pollutionReport.findMany({
    orderBy: { recordedAt: "desc" },
    take: 50,
  });

  const criticalRegions = getCriticalRegions(reports);
  const avgAqi =
    reports.length > 0
      ? Math.round(
          reports.reduce((acc, curr) => acc + curr.aqi, 0) / reports.length
        )
      : 185; // Mock avg

  return (
    <div className="container mx-auto p-6 space-y-8 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Government Command Center
          </h1>
          <p className="text-slate-500">
            Real-time pollution monitoring and alert management system.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1 text-sm bg-white">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Badge>
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Alerts Sent
            </CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alerts.length}</div>
            <p className="text-xs text-muted-foreground">+2 from last hour</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Critical Zones
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {criticalRegions.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Pollution Index
            </CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAqi}</div>
            <p className="text-xs text-muted-foreground">
              Moderate levels overall
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Operational</div>
            <p className="text-xs text-muted-foreground">All sensors active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Critical Alerts
            {criticalRegions.length > 0 && (
              <Badge
                variant="destructive"
                className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px]"
              >
                {criticalRegions.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" /> Alert History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Real-time Air Quality Monitoring</CardTitle>
              <CardDescription>
                Live data from monitoring stations across the region.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AqiDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {criticalRegions.map((region: any) => {
              const isAlertSent = alertedRegions.has(region.region);
              const regionName = getSiteName(region.region);

              let TrendIcon = Minus;
              let trendColor = "text-gray-500";
              if (region.forecast === "Rising") {
                TrendIcon = ArrowUpRight;
                trendColor = "text-red-500";
              } else if (region.forecast === "Falling") {
                TrendIcon = ArrowDownRight;
                trendColor = "text-green-500";
              }

              return (
                <Card
                  key={region.id}
                  className={`border-l-4 shadow-md hover:shadow-lg transition-shadow ${
                    isAlertSent
                      ? "border-l-gray-400 bg-gray-50"
                      : "border-l-red-500"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle
                        className={`text-lg font-bold flex items-center gap-2 ${
                          isAlertSent ? "text-gray-600" : "text-red-700"
                        }`}
                      >
                        {isAlertSent ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5" />
                        )}
                        {regionName}
                      </CardTitle>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant={isAlertSent ? "secondary" : "destructive"}
                          className="text-sm"
                        >
                          Index: {region.aqi}
                        </Badge>
                        <div
                          className={`flex items-center text-xs font-medium ${trendColor}`}
                        >
                          <TrendIcon className="h-3 w-3 mr-1" />
                          {region.forecast}
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      <span className="font-semibold">
                        Category: {region.fullCategory}
                      </span>
                      <br />
                      High concentration of {region.pollutant} detected.
                      {region.details && (
                        <span className="text-xs text-muted-foreground block mt-1">
                          NO2: {region.details.NO2.val} (
                          {region.details.NO2.cat}) | O3:{" "}
                          {region.details.O3.val} ({region.details.O3.cat})
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                      Recorded at: {region.recordedAt.toLocaleString()}
                    </div>
                    <form action={sendAlert} className="space-y-4">
                      <input
                        type="hidden"
                        name="title"
                        value={`${region.category} Pollution Alert: ${regionName}`}
                      />
                      <input
                        type="hidden"
                        name="message"
                        value={`${
                          region.fullCategory
                        } air quality detected in ${regionName}. Dominant pollutant: ${
                          region.pollutant
                        } (Level: ${region.aqi}). Forecast indicates ${
                          region.forecast || "continued high levels"
                        }. Immediate action required.`}
                      />
                      <input
                        type="hidden"
                        name="severity"
                        value={
                          region.category === "Severe" ? "CRITICAL" : "HIGH"
                        }
                      />
                      <input
                        type="hidden"
                        name="region"
                        value={region.region}
                      />

                      {!isAlertSent && (
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Target Departments
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              "Health Dept",
                              "Traffic Police",
                              "Education Board",
                              "Industrial Control",
                            ].map((dept) => (
                              <label
                                key={dept}
                                className="flex items-center space-x-2 text-xs border p-2 rounded hover:bg-slate-50 cursor-pointer bg-white"
                              >
                                <input
                                  type="checkbox"
                                  name="recipient"
                                  value={dept}
                                  defaultChecked
                                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 h-3 w-3"
                                />
                                <span>{dept}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {isAlertSent && (
                        <input
                          type="hidden"
                          name="recipient"
                          value="Previously Sent"
                        />
                      )}

                      <Button
                        type="submit"
                        disabled={isAlertSent}
                        className={`w-full shadow-sm ${
                          isAlertSent
                            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white"
                        }`}
                      >
                        {isAlertSent ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Alert Sent (Cooldown)
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Send Alert to Authorities
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              );
            })}
            {criticalRegions.length === 0 && (
              <div className="col-span-full p-12 text-center border-2 border-dashed rounded-lg bg-slate-50">
                <CheckCircle className="mx-auto h-12 w-12 mb-4 text-green-500" />
                <h3 className="text-xl font-medium text-slate-900">
                  All Systems Normal
                </h3>
                <p className="text-slate-500 mt-2">
                  No critical pollution levels detected at this time.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Alert Log</CardTitle>
              <CardDescription>
                Comprehensive history of all alerts sent to authorities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">
                        {alert.title}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            alert.severity === "CRITICAL"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{alert.recipient}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {alert.status}
                        </div>
                      </TableCell>
                      <TableCell>{alert.createdAt.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {alerts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No alerts sent yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
