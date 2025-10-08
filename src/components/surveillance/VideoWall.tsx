import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Pause, Maximize2, Volume2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface VideoStream {
  id: string;
  name: string;
  location: string;
  status: "live" | "recording" | "offline";
  alerts: number;
  thumbnail: string;
}

const mockStreams: VideoStream[] = [
  { id: "1", name: "Main Entrance", location: "Building A", status: "live", alerts: 2, thumbnail: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&h=600&fit=crop" },
  { id: "2", name: "Parking Lot", location: "West Wing", status: "live", alerts: 0, thumbnail: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=800&h=600&fit=crop" },
  { id: "3", name: "Corridor B-2", location: "Building B", status: "live", alerts: 1, thumbnail: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=600&fit=crop" },
  { id: "4", name: "Perimeter North", location: "Fence Line", status: "recording", alerts: 0, thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop" },
  { id: "5", name: "Loading Bay", location: "Building C", status: "live", alerts: 0, thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop" },
  { id: "6", name: "Server Room", location: "Building A", status: "live", alerts: 0, thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop" },
];

export const VideoWall = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Video Feeds</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            {mockStreams.filter(s => s.status === "live").length} Active
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
            {mockStreams.filter(s => s.status === "recording").length} Recording
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockStreams.map((stream) => (
          <Card
            key={stream.id}
            className={`glass-panel overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
              selectedStream === stream.id ? "ring-2 ring-primary glow-primary" : ""
            }`}
            onClick={() => setSelectedStream(stream.id)}
          >
            <div className="relative aspect-video bg-muted">
              <img
                src={stream.thumbnail}
                alt={stream.name}
                className="w-full h-full object-cover"
              />
              
              {stream.status === "live" && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-destructive/90 rounded text-xs font-medium">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  LIVE
                </div>
              )}

              {stream.alerts > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-warning/90 rounded text-xs font-medium glow-alert">
                  <AlertTriangle className="w-3 h-3" />
                  {stream.alerts}
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{stream.name}</p>
                    <p className="text-xs text-muted-foreground">{stream.location}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Volume2 className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
