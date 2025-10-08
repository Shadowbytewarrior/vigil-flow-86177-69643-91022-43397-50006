import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': Deno.env.get('ALLOWED_ORIGIN') || '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const MAX_REQUEST_SIZE = 10 * 1024 * 1024; // 10MB

interface DetectionResult {
  object: string;
  confidence: number;
  bbox: number[];
  timestamp: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request size
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Request size exceeds 10MB limit' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { imageData, videoId } = await req.json();

    if (!imageData) {
      return new Response(
        JSON.stringify({ error: 'No image data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (!videoId) {
      return new Response(
        JSON.stringify({ error: 'No video ID provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Starting AI analysis for video:', videoId);
    const startTime = Date.now();

    // Simulated YOLO detection results (in production, integrate with actual YOLO model)
    // For real implementation, you would:
    // 1. Deploy YOLO model to cloud (AWS Lambda, GCP Cloud Run, or Roboflow)
    // 2. Send image frames to the model endpoint
    // 3. Process and aggregate results
    
    const mockDetections: DetectionResult[] = [
      {
        object: 'person',
        confidence: 0.95,
        bbox: [100, 150, 300, 450],
        timestamp: new Date().toISOString()
      },
      {
        object: 'car',
        confidence: 0.87,
        bbox: [400, 200, 700, 500],
        timestamp: new Date().toISOString()
      },
      {
        object: 'backpack',
        confidence: 0.82,
        bbox: [250, 300, 350, 420],
        timestamp: new Date().toISOString()
      }
    ];

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const processingTime = Date.now() - startTime;

    const analysisResult = {
      videoId,
      detections: mockDetections,
      processingTime,
      modelVersion: 'YOLOv8n',
      timestamp: new Date().toISOString(),
      summary: {
        totalObjects: mockDetections.length,
        avgConfidence: mockDetections.reduce((sum, d) => sum + d.confidence, 0) / mockDetections.length,
        uniqueObjects: [...new Set(mockDetections.map(d => d.object))],
      }
    };

    console.log('Analysis complete:', analysisResult.summary);

    return new Response(
      JSON.stringify(analysisResult),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'AI analysis failed'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
