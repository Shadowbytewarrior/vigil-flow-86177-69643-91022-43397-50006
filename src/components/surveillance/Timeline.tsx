import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Pause, SkipBack, SkipForward, Calendar } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

interface TimelineEvent {
  id: string;
  time: string;
  type: "detection" | "alert" | "tracking";
  description: string;
  camera: string;
  confidence: number;
}

const mockEvents: TimelineEvent[] = [
  { id: "1", time: "14:32:15", type: "alert", description: "Unauthorized person detected", camera: "Main Entrance", confidence: 95 },
  { id: "2", time: "14:28:42", type: "tracking", description: "Object tracked across cameras", camera: "Multiple", confidence: 88 },
  { id: "3", time: "14:25:10", type: "detection", description: "Vehicle detected", camera: "Parking Lot", confidence: 92 },
  { id: "4", time: "14:20:33", type: "detection", description: "Person detected", camera: "Corridor B-2", confidence: 97 },
  { id: "5", time: "14:15:21", type: "alert", description: "Loitering detected", camera: "Loading Bay", confidence: 85 },
];

export const Timeline = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState([50]);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(),
  });

  return (
    <div className="space-y-4">
      <Card className="glass-panel p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Event Timeline & Playback</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "gap-2 justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="w-4 h-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Select Date Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Video Preview */}
          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1200&h=675&fit=crop"
              alt="Timeline preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
              <Button
                size="lg"
                className="rounded-full w-16 h-16"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Timeline Controls */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono text-muted-foreground">14:15:21</span>
              <Slider
                value={currentTime}
                onValueChange={setCurrentTime}
                max={100}
                step={1}
                className="flex-1"
              />
              <span className="text-sm font-mono text-muted-foreground">14:45:30</span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="icon">
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Events List */}
      <Card className="glass-panel p-6">
        <h3 className="font-semibold mb-4">Detected Events</h3>
        <div className="space-y-3">
          {mockEvents.map((event, index) => (
            <div
              key={event.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            >
              <div className="relative flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
                {index !== mockEvents.length - 1 && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-px h-12 bg-border" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono text-muted-foreground">{event.time}</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.type === "alert"
                        ? "bg-destructive/10 text-destructive border-destructive/30"
                        : event.type === "tracking"
                        ? "bg-warning/10 text-warning border-warning/30"
                        : "bg-primary/10 text-primary border-primary/30"
                    }`}
                  >
                    {event.type}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{event.description}</p>
                <p className="text-xs text-muted-foreground">{event.camera}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">{event.confidence}%</p>
                <p className="text-xs text-muted-foreground">confidence</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
