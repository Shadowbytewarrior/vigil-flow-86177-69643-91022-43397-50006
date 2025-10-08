import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Target, AlertTriangle, TrendingUp } from "lucide-react";

interface DetectionResult {
  object: string;
  confidence: number;
  bbox: number[];
  timestamp: string;
}

interface AIAnalysisProps {
  detections?: DetectionResult[];
  processingTime?: number;
  modelVersion?: string;
}

export const AIAnalysisDashboard = ({ 
  detections = [], 
  processingTime = 0,
  modelVersion = "YOLOv8n"
}: AIAnalysisProps) => {
  const totalDetections = detections.length;
  const avgConfidence = detections.length > 0 
    ? (detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100).toFixed(1)
    : 0;
  
  const threatLevel = detections.some(d => d.confidence > 0.9) ? "high" : 
                      detections.some(d => d.confidence > 0.7) ? "medium" : "low";

  const objectCounts = detections.reduce((acc, detection) => {
    acc[detection.object] = (acc[detection.object] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 animate-fade-in">
      {/* AI Analysis Header */}
      <div className="gov-section p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">AI Analysis Results</h3>
            <p className="text-xs text-muted-foreground">
              Powered by {modelVersion} • Processing: {processingTime}ms
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="gov-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Detections</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalDetections}</p>
          </div>

          <div className="gov-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs font-medium text-muted-foreground">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{avgConfidence}%</p>
          </div>

          <div className="gov-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={`w-4 h-4 ${
                threatLevel === 'high' ? 'text-destructive' : 
                threatLevel === 'medium' ? 'text-warning' : 'text-success'
              }`} />
              <span className="text-xs font-medium text-muted-foreground">Threat Level</span>
            </div>
            <Badge className={`
              ${threatLevel === 'high' ? 'status-alert' : ''}
              ${threatLevel === 'medium' ? 'bg-warning/10 text-warning border-warning/30' : ''}
              ${threatLevel === 'low' ? 'status-complete' : ''}
            `}>
              {threatLevel.toUpperCase()}
            </Badge>
          </div>

          <div className="gov-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-accent-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Objects</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{Object.keys(objectCounts).length}</p>
          </div>
        </div>
      </div>

      {/* Detection Details */}
      {detections.length > 0 && (
        <div className="gov-section p-6">
          <h4 className="font-semibold mb-4">Detected Objects</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {Object.entries(objectCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([object, count]) => (
                <div key={object} className="flex items-center justify-between p-3 gov-card">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium capitalize">{object}</span>
                  </div>
                  <Badge variant="outline" className="gov-badge">
                    {count} detected
                  </Badge>
                </div>
              ))}
          </div>
        </div>
      )}

      {detections.length === 0 && (
        <div className="gov-card p-8 text-center">
          <Brain className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No detections yet</p>
          <p className="text-xs text-muted-foreground mt-1">Upload a video or image to analyze</p>
        </div>
      )}
    </div>
  );
};
