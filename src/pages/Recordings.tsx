import { useState, useEffect } from "react";
import { Header } from "@/components/surveillance/Header";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Video, Clock, CheckCircle, AlertTriangle, Search, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { AIAnalysisDashboard } from "@/components/AIAnalysisDashboard";
interface VideoUpload {
  id: string;
  file_name: string;
  file_size: number;
  upload_date: string;
  analysis_status: string;
  duration_seconds?: number;
  tags?: string[];
  camera_id?: string;
}
const Recordings = () => {
  const {
    user
  } = useAuth();
  const {
    toast
  } = useToast();
  const [videos, setVideos] = useState<VideoUpload[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  useEffect(() => {
    fetchVideos();
  }, []);
  const fetchVideos = async () => {
    const {
      data
    } = await supabase.from("video_uploads").select("*").order("upload_date", {
      ascending: false
    });
    if (data) {
      setVideos(data);
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        // 500MB limit
        toast({
          title: "File too large",
          description: "Please select a file smaller than 500MB",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };
  const handleUpload = async () => {
    if (!selectedFile || !user) return;
    setUploading(true);
    try {
      // Insert video metadata
      const {
        data,
        error
      } = await supabase.from("video_uploads").insert({
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        storage_path: `uploads/${user.id}/${selectedFile.name}`,
        uploaded_by: user.id,
        analysis_status: "processing"
      }).select().single();
      if (error) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive"
        });
        setUploading(false);
        return;
      }

      // Trigger AI analysis
      setAnalyzing(true);

      // Extract a thumbnail frame from the video and analyze it with Lovable AI
      const getThumbnailBase64 = () => new Promise<string>((resolve, reject) => {
        try {
          const videoEl = document.createElement("video");
          videoEl.preload = "metadata";
          videoEl.muted = true;
          videoEl.src = URL.createObjectURL(selectedFile);
          videoEl.onloadeddata = () => {
            // Seek slightly to avoid black frames
            videoEl.currentTime = Math.min(1, videoEl.duration / 2 || 1);
          };
          videoEl.onseeked = () => {
            const canvas = document.createElement("canvas");
            canvas.width = videoEl.videoWidth || 640;
            canvas.height = videoEl.videoHeight || 360;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Canvas context not available"));
              return;
            }
            ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            const base64 = dataUrl.split(",")[1] || "";
            URL.revokeObjectURL(videoEl.src);
            resolve(base64);
          };
          videoEl.onerror = () => reject(new Error("Unable to load video"));
        } catch (e) {
          reject(e);
        }
      });
      try {
        const imageBase64 = await getThumbnailBase64();
        const {
          data: functionData,
          error: functionError
        } = await supabase.functions.invoke("analyze-image", {
          body: {
            imageData: imageBase64,
            videoId: data.id
          }
        });
        if (functionError) {
          throw functionError;
        }
        setAnalysisResults(functionData);

        // Update video status
        await supabase.from("video_uploads").update({
          analysis_status: "completed",
          analysis_results: functionData
        }).eq("id", data.id);
        toast({
          title: "Analysis complete",
          description: `Detected ${functionData?.detections?.length ?? 0} objects`
        });
      } catch (analysisError) {
        console.error("Analysis error:", analysisError);
        await supabase.from("video_uploads").update({
          analysis_status: "failed"
        }).eq("id", data.id);
        toast({
          title: "Analysis failed",
          description: analysisError instanceof Error ? analysisError.message : "Could not analyze video",
          variant: "destructive"
        });
      } finally {
        setAnalyzing(false);
      }
      toast({
        title: "Video uploaded",
        description: "AI analysis in progress..."
      });
      setSelectedFile(null);
      fetchVideos();
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/30"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case "processing":
        return <Badge className="bg-primary/10 text-primary border-primary/30"><Clock className="w-3 h-3 mr-1 animate-spin" />Processing</Badge>;
      case "failed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/30"><AlertTriangle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="outline"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    }
  };
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  const filteredVideos = videos.filter(video => video.file_name.toLowerCase().includes(searchQuery.toLowerCase()));
  return <div className="min-h-screen bg-background pb-20 lg:pb-0 overflow-x-hidden">
      <Header />

      <div className="container mx-auto p-4 sm:p-6 space-y-6 max-w-7xl w-full">
        {/* Professional Header */}
        <div className="gov-section p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Video Analysis & Recordings</h1>
              <p className="text-sm text-muted-foreground">AI-powered video processing with YOLO object detection</p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card className="gov-section p-6">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Upload for AI Analysis</h2>
          </div>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-all">
              <input type="file" accept="video/*" onChange={handleFileSelect} className="hidden" id="video-upload" />
              <label htmlFor="video-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-muted-foreground">
                  MP4, AVI, MOV (max 500MB)
                </p>
              </label>
            </div>

            {selectedFile && <div className="flex items-center justify-between p-4 gov-card">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Video className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpload} disabled={uploading} className="bg-primary hover:bg-primary/90">
                    {uploading ? "Uploading..." : "Upload & Analyze"}
                  </Button>
                </div>
              </div>}
          </div>
        </Card>

        {/* AI Analysis Results */}
        {analysisResults && <AIAnalysisDashboard detections={analysisResults.detections} processingTime={analysisResults.processingTime} modelVersion={analysisResults.modelVersion} />}

        {/* Recordings List */}
        <Card className="gov-section overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Brain className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold">Video Library</h2>
                  <p className="text-xs text-muted-foreground">
                    {videos.length} video{videos.length !== 1 ? "s" : ""} analyzed
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search videos by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 border-border" />
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-28rem)] w-full">
            <div className="p-4 space-y-3 w-full overflow-hidden">
              {filteredVideos.length === 0 ? <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <Video className="w-12 h-12 mb-2" />
                  <p>No videos found</p>
                  <p className="text-xs">Upload a video to begin analysis</p>
                </div> : filteredVideos.map(video => <div key={video.id} className="gov-card p-4 rounded-sm overflow-hidden px-[10px]">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-primary/20 rounded-lg shrink-0">
                          <Video className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{video.file_name}</p>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span className="whitespace-nowrap">{formatFileSize(video.file_size)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="whitespace-nowrap">{formatDuration(video.duration_seconds)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="whitespace-nowrap">{new Date(video.upload_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {getStatusBadge(video.analysis_status)}
                      </div>
                    </div>

                    {video.tags && video.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">
                        {video.tags.map((tag, i) => <Badge key={i} variant="outline" className="text-xs truncate max-w-full">
                            {tag}
                          </Badge>)}
                      </div>}
                  </div>)}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <MobileNav />
    </div>;
};
export default Recordings;