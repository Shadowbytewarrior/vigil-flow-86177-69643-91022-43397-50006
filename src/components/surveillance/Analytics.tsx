import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, AlertTriangle, CheckCircle, Camera, Users } from "lucide-react";

const stats = [
  { label: "Active Cameras", value: "12", change: "+2", icon: Camera, trend: "up" },
  { label: "Detections Today", value: "847", change: "+15%", icon: Activity, trend: "up" },
  { label: "Active Alerts", value: "3", change: "-2", icon: AlertTriangle, trend: "down" },
  { label: "Tracked Objects", value: "156", change: "+8%", icon: Users, trend: "up" },
];

export const Analytics = () => {
  return (
    <div className="space-y-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="glass-panel p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold mb-2">{stat.value}</p>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      stat.trend === "up"
                        ? "bg-success/10 text-success border-success/30"
                        : "bg-primary/10 text-primary border-primary/30"
                    }`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <div className="p-3 bg-primary/20 rounded-lg">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-panel p-6">
          <h3 className="font-semibold mb-4">Detection Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {[65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 70, 88].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all hover:from-primary hover:to-primary/70"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </Card>

        <Card className="glass-panel p-6">
          <h3 className="font-semibold mb-4">Alert Distribution</h3>
          <div className="space-y-4">
            {[
              { label: "Unauthorized Access", value: 45, color: "bg-destructive" },
              { label: "Loitering", value: 30, color: "bg-warning" },
              { label: "Vehicle Detection", value: 15, color: "bg-primary" },
              { label: "Motion Detection", value: 10, color: "bg-success" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span>{item.label}</span>
                  <span className="font-medium">{item.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* System Health */}
      <Card className="glass-panel p-6">
        <h3 className="font-semibold mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "AI Model Performance", value: 98, status: "Excellent" },
            { label: "Stream Uptime", value: 99.9, status: "Optimal" },
            { label: "Processing Speed", value: 95, status: "Good" },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--muted))"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${metric.value * 2.51} 251`}
                    className="glow-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{metric.value}%</span>
                </div>
              </div>
              <p className="font-medium mb-1">{metric.label}</p>
              <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                <CheckCircle className="w-3 h-3 mr-1" />
                {metric.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
