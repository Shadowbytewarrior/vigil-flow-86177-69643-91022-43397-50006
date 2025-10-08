import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { MobileNav } from "@/components/MobileNav";
import { VideoWall } from "@/components/surveillance/VideoWall";
import { MapView } from "@/components/surveillance/MapView";
import { AlertPanel } from "@/components/surveillance/AlertPanel";
import { Timeline } from "@/components/surveillance/Timeline";
import { Analytics } from "@/components/surveillance/Analytics";
import { Header } from "@/components/surveillance/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("live");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6 max-w-7xl">
        {/* Professional Header */}
        <div className="gov-section p-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Security Monitoring Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time surveillance and threat detection system</p>
        </div>

        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <div className="gov-section p-1 overflow-x-auto">
            <TabsList className="w-full min-w-max inline-flex justify-start">
              <TabsTrigger value="live" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Live Feed
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Map View
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Timeline
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex-shrink-0">
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
            <div className="lg:col-span-3 space-y-6">
              <TabsContent value="live" className="m-0">
                <VideoWall />
              </TabsContent>
              
              <TabsContent value="map" className="m-0">
                <MapView />
              </TabsContent>
              
              <TabsContent value="timeline" className="m-0">
                <Timeline />
              </TabsContent>
              
              <TabsContent value="analytics" className="m-0">
                <Analytics />
              </TabsContent>
            </div>

            <div className="lg:col-span-1">
              <AlertPanel />
            </div>
          </div>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
};

export default Dashboard;
