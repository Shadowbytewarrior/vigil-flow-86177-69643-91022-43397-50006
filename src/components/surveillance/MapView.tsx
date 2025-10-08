import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, AlertTriangle, MapPin } from "lucide-react";

export const MapView = () => {
  const cameras = [
    { id: 1, name: "Main Entrance", x: 30, y: 40, status: "active", alerts: 2 },
    { id: 2, name: "Parking Lot", x: 60, y: 30, status: "active", alerts: 0 },
    { id: 3, name: "Corridor B-2", x: 45, y: 60, status: "active", alerts: 1 },
    { id: 4, name: "Perimeter North", x: 70, y: 20, status: "recording", alerts: 0 },
    { id: 5, name: "Loading Bay", x: 20, y: 70, status: "active", alerts: 0 },
  ];

  return (
    <Card className="glass-panel p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Camera Locations</h2>
          <div className="flex gap-2">
            <Badge variant="outline" className="gap-1">
              <Camera className="w-3 h-3" />
              {cameras.length} Cameras
            </Badge>
            <Badge variant="outline" className="gap-1 bg-warning/10 text-warning border-warning/30">
              <AlertTriangle className="w-3 h-3" />
              {cameras.filter(c => c.alerts > 0).length} Alerts
            </Badge>
          </div>
        </div>

        <div className="relative w-full aspect-video bg-muted/30 rounded-lg border border-border overflow-hidden">
          {/* Simulated map background */}
          <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }} />
          </div>

          {/* Camera markers */}
          {cameras.map((camera) => (
            <div
              key={camera.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${camera.x}%`, top: `${camera.y}%` }}
            >
              <div className={`
                relative p-2 rounded-full transition-all
                ${camera.alerts > 0 
                  ? 'bg-warning/20 ring-2 ring-warning glow-alert' 
                  : 'bg-primary/20 ring-2 ring-primary/50 group-hover:ring-primary glow-primary'
                }
              `}>
                <Camera className="w-4 h-4 text-primary" />
                {camera.alerts > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-warning rounded-full flex items-center justify-center text-[10px] font-bold">
                    {camera.alerts}
                  </div>
                )}
              </div>
              
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="glass-panel px-3 py-2 rounded text-xs whitespace-nowrap">
                  <p className="font-medium">{camera.name}</p>
                  <p className="text-muted-foreground capitalize">{camera.status}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass-panel p-3 rounded-lg space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/20 ring-2 ring-primary" />
              <span>Active Camera</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning/20 ring-2 ring-warning" />
              <span>Alert Detected</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground text-center">
          <MapPin className="w-4 h-4 inline mr-1" />
          Real-time camera positioning with Mapbox integration ready
        </div>
      </div>
    </Card>
  );
};
