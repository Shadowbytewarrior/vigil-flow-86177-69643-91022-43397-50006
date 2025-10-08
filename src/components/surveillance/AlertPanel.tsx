import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";

interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  title: string;
  location: string;
  time: string;
  description: string;
  status: "active" | "reviewing" | "resolved";
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Unauthorized Access Detected",
    location: "Main Entrance",
    time: "2 min ago",
    description: "Person detected in restricted area",
    status: "active"
  },
  {
    id: "2",
    type: "warning",
    title: "Loitering Detected",
    location: "Parking Lot",
    time: "5 min ago",
    description: "Individual stationary for 10+ minutes",
    status: "reviewing"
  },
  {
    id: "3",
    type: "critical",
    title: "Perimeter Breach",
    location: "Corridor B-2",
    time: "8 min ago",
    description: "Motion detected in secure zone",
    status: "active"
  },
  {
    id: "4",
    type: "info",
    title: "Vehicle Detected",
    location: "Loading Bay",
    time: "15 min ago",
    description: "Delivery truck arrived",
    status: "resolved"
  },
];

const alertColors = {
  critical: { bg: "bg-destructive/10", border: "border-destructive/30", text: "text-destructive" },
  warning: { bg: "bg-warning/10", border: "border-warning/30", text: "text-warning" },
  info: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary" },
};

export const AlertPanel = () => {
  return (
    <Card className="glass-panel h-[calc(100vh-12rem)]">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Active Alerts</h3>
          <Badge variant="destructive" className="glow-alert">
            {mockAlerts.filter(a => a.status === "active").length}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">Real-time threat detection</p>
      </div>

      <ScrollArea className="h-[calc(100%-5rem)]">
        <div className="p-4 space-y-3">
          {mockAlerts.map((alert) => {
            const colors = alertColors[alert.type];
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${colors.bg} ${colors.border} transition-all hover:scale-[1.02]`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${colors.text}`} />
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.location}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                </div>

                <p className="text-xs mb-3">{alert.description}</p>

                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      alert.status === "active"
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : alert.status === "reviewing"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-success/10 text-success border-success/30"
                    }`}
                  >
                    {alert.status === "active" && <XCircle className="w-3 h-3 mr-1" />}
                    {alert.status === "reviewing" && <Eye className="w-3 h-3 mr-1" />}
                    {alert.status === "resolved" && <CheckCircle className="w-3 h-3 mr-1" />}
                    {alert.status}
                  </Badge>
                  <Button size="sm" variant="ghost" className="h-7 text-xs">
                    Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
};
