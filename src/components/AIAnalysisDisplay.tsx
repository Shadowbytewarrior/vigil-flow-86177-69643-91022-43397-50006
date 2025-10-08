import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, CheckCircle, AlertTriangle } from "lucide-react";

interface Detection {
  label: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface AIAnalysisDisplayProps {
  detections: Detection[];
  imageUrl?: string;
  timestamp: string;
}

export const AIAnalysisDisplay = ({ detections, imageUrl, timestamp }: AIAnalysisDisplayProps) => {
  const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length;

  return (
    <Card className="neu-card p-6 animate-scale-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 neu-card">
          <Brain className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h3 className="font-semibold">AI Analysis Results</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Image with Bounding Boxes */}
      {imageUrl && (
        <div className="relative neu-card-pressed p-2 mb-4">
          <img 
            src={imageUrl} 
            alt="Analyzed" 
            className="w-full h-auto rounded-lg"
          />
          {/* SVG overlay for bounding boxes */}
          <svg 
            className="absolute top-2 left-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {detections.map((detection, idx) => (
              <g key={idx}>
                <rect
                  x={detection.bbox.x}
                  y={detection.bbox.y}
                  width={detection.bbox.width}
                  height={detection.bbox.height}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="0.5"
                  className="animate-pulse"
                />
                <text
                  x={detection.bbox.x}
                  y={detection.bbox.y - 1}
                  fontSize="3"
                  fill="hsl(var(--primary))"
                  fontWeight="bold"
                >
                  {detection.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="neu-card-pressed p-3">
          <p className="text-xs text-muted-foreground mb-1">Objects Detected</p>
          <p className="text-2xl font-bold text-primary">{detections.length}</p>
        </div>
        <div className="neu-card-pressed p-3">
          <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
          <p className="text-2xl font-bold text-success">
            {(avgConfidence * 100).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Detections List */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold mb-2">Detected Objects:</h4>
        {detections.map((detection, idx) => (
          <div key={idx} className="neu-card-pressed p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {detection.confidence > 0.8 ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
                <span className="font-medium text-sm">{detection.label}</span>
              </div>
              <Badge 
                className={
                  detection.confidence > 0.8 
                    ? "status-complete" 
                    : detection.confidence > 0.6 
                    ? "status-processing" 
                    : "bg-muted text-muted-foreground"
                }
              >
                {(detection.confidence * 100).toFixed(1)}%
              </Badge>
            </div>
            <Progress 
              value={detection.confidence * 100} 
              className="h-1"
            />
          </div>
        ))}
      </div>
    </Card>
  );
};
