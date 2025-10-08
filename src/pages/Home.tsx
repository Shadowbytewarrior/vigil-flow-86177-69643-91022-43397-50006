import { useEffect, useState } from "react";
import { Header } from "@/components/surveillance/Header";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock, TrendingUp, Video, Shield, Brain, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
interface ActivityItem {
  id: string;
  type: "alert" | "incident" | "video" | "system";
  title: string;
  description: string;
  time: string;
  severity?: string;
  icon: any;
}
const Home = () => {
  const {
    user
  } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({
    activeAlerts: 0,
    openIncidents: 0,
    activeCameras: 0,
    todayAnalysis: 0
  });
  useEffect(() => {
    fetchDashboardData();

    // Set up real-time subscriptions
    const alertsChannel = supabase.channel('alerts-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'alerts'
    }, () => {
      fetchDashboardData();
    }).subscribe();
    const incidentsChannel = supabase.channel('incidents-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'incidents'
    }, () => {
      fetchDashboardData();
    }).subscribe();
    return () => {
      supabase.removeChannel(alertsChannel);
      supabase.removeChannel(incidentsChannel);
    };
  }, []);
  const fetchDashboardData = async () => {
    // Fetch active alerts
    const {
      data: alerts
    } = await supabase.from("alerts").select("*").eq("status", "active").order("created_at", {
      ascending: false
    }).limit(3);

    // Fetch open incidents
    const {
      data: incidents
    } = await supabase.from("incidents").select("*").in("status", ["open", "investigating"]).order("created_at", {
      ascending: false
    }).limit(3);

    // Fetch camera count
    const {
      count: cameraCount
    } = await supabase.from("cameras").select("*", {
      count: "exact",
      head: true
    }).eq("status", "active");

    // Fetch today's video uploads
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const {
      count: videoCount
    } = await supabase.from("video_uploads").select("*", {
      count: "exact",
      head: true
    }).gte("created_at", today.toISOString());
    setStats({
      activeAlerts: alerts?.length || 0,
      openIncidents: incidents?.length || 0,
      activeCameras: cameraCount || 0,
      todayAnalysis: videoCount || 0
    });

    // Combine activities
    const activityItems: ActivityItem[] = [];
    alerts?.forEach(alert => {
      activityItems.push({
        id: alert.id,
        type: "alert",
        title: alert.title,
        description: alert.location,
        time: new Date(alert.created_at).toLocaleTimeString(),
        severity: alert.severity,
        icon: AlertTriangle
      });
    });
    incidents?.forEach(incident => {
      activityItems.push({
        id: incident.id,
        type: "incident",
        title: incident.title,
        description: incident.location,
        time: new Date(incident.created_at).toLocaleTimeString(),
        severity: incident.severity,
        icon: Shield
      });
    });
    setActivities(activityItems.sort((a, b) => b.time.localeCompare(a.time)));
  };
  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "status-alert";
      case "high":
        return "bg-warning/10 text-warning border-warning/30";
      case "medium":
        return "status-processing";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  return <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-7xl">
        {/* Professional Header */}
        <div className="neu-card p-4 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2"> Dashboard</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">AI-Powered Security Management Platform</p>
            </div>
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg shrink-0">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
          <Card className="neu-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <Badge className="status-alert text-[10px] sm:text-xs">Live</Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.activeAlerts}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Active Alerts</p>
          </Card>

          <Card className="gov-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-warning/10 rounded-lg">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
              </div>
              <Badge className="bg-warning/10 text-warning border-warning/30 text-[10px] sm:text-xs">Pending</Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.openIncidents}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Open Incidents</p>
          </Card>

          <Card className="gov-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <Badge className="status-complete text-[10px] sm:text-xs">Online</Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.activeCameras}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">Active Cameras</p>
          </Card>

          <Card className="gov-card p-4 sm:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-success/10 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
              </div>
              <Badge className="status-processing text-[10px] sm:text-xs">Today</Badge>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">{stats.todayAnalysis}</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">AI Analysis</p>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="neu-card animate-fade-in">
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex items-center gap-2 sm:gap-3">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-semibold truncate">Recent Activity</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Latest alerts and incidents</p>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[300px] sm:h-[400px] lg:h-[calc(100vh-32rem)]">
            <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
              {activities.length === 0 ? <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-muted-foreground">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 text-success" />
                  <p className="font-medium text-sm sm:text-base">No recent activity</p>
                  <p className="text-[10px] sm:text-xs">All systems operating normally</p>
                </div> : activities.map(activity => {
              const Icon = activity.icon;
              return <div key={activity.id} className="gov-card p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className={`p-1.5 sm:p-2 rounded-lg gov-badge shrink-0 ${getSeverityColor(activity.severity)}`}>
                          <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start sm:items-center gap-2 mb-1 flex-wrap">
                            <p className="font-medium text-xs sm:text-sm truncate">{activity.title}</p>
                            {activity.severity && <Badge className={`text-[10px] sm:text-xs gov-badge shrink-0 ${getSeverityColor(activity.severity)}`}>
                                {activity.severity.toUpperCase()}
                              </Badge>}
                          </div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{activity.description}</p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>;
            })}
            </div>
          </ScrollArea>
        </Card>
      </main>

      <MobileNav />
    </div>;
};
export default Home;