import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Header } from "@/components/surveillance/Header";
import { MobileNav } from "@/components/MobileNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Eye, 
  Moon, 
  Save,
  UserCircle2,
  Mail,
  Phone,
  Building,
  LogOut,
  User
} from "lucide-react";

const Settings = () => {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    alertThreshold: "medium",
    autoAnalysis: true,
    dataRetention: "30",
    twoFactor: false,
    language: "en",
  });
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    department: "",
    badge_number: "",
  });
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchUserRole();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile({
        full_name: data.full_name || "",
        email: data.email || "",
        phone: data.phone || "",
        department: data.department || "",
        badge_number: data.badge_number || "",
      });
    }
  };

  const fetchUserRole = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setUserRole(data.role);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        phone: profile.phone,
        department: profile.department,
        badge_number: profile.badge_number,
      })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }

    setLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "security":
        return "bg-primary/10 text-primary border-primary/30";
      case "faculty":
        return "bg-success/10 text-success border-success/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header />

      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        {/* Header */}
        <div className="neu-card p-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 neu-card">
              <SettingsIcon className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Settings & Profile</h1>
              <p className="text-sm text-muted-foreground">Manage your preferences, profile and security</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <Card className="neu-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <UserCircle2 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Profile</h2>
          </div>
          <Separator className="mb-4" />
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <UserCircle2 className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              {userRole && (
                <Badge variant="outline" className={`mt-2 ${getRoleBadgeColor(userRole)}`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {userRole.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">
                <User className="w-4 h-4 inline mr-2" />
                Full Name
              </Label>
              <Input
                id="full_name"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="neu-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="neu-input opacity-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="neu-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                <Building className="w-4 h-4 inline mr-2" />
                Department
              </Label>
              <Input
                id="department"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                placeholder="Campus Security"
                className="neu-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge_number">
                <Shield className="w-4 h-4 inline mr-2" />
                Badge Number
              </Label>
              <Input
                id="badge_number"
                value={profile.badge_number}
                onChange={(e) => setProfile({ ...profile, badge_number: e.target.value })}
                placeholder="SEC-001"
                className="neu-input"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving Profile..." : "Save Profile"}
            </Button>
          </form>
        </Card>

        {/* Notifications */}
        <Card className="neu-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-xs text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-xs text-muted-foreground">Browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Alert Threshold</Label>
              <select
                className="neu-input w-full p-2 text-sm text-foreground"
                value={settings.alertThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, alertThreshold: e.target.value })
                }
              >
                <option value="low">Low - All alerts</option>
                <option value="medium">Medium - Important alerts</option>
                <option value="high">High - Critical only</option>
              </select>
            </div>
          </div>
        </Card>

        {/* AI & Analysis */}
        <Card className="neu-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">AI & Analysis</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-Analysis</Label>
                <p className="text-xs text-muted-foreground">Automatically analyze uploaded videos</p>
              </div>
              <Switch
                checked={settings.autoAnalysis}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoAnalysis: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Data Retention (days)</Label>
              <Input
                type="number"
                className="neu-input"
                value={settings.dataRetention}
                onChange={(e) =>
                  setSettings({ ...settings, dataRetention: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                Video data will be automatically deleted after this period
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="neu-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Security</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch
                checked={settings.twoFactor}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, twoFactor: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Change Password</Label>
              <Button variant="outline" className="w-full">
                Update Password
              </Button>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="neu-card p-6 animate-slide-up">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <Separator className="mb-4" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Use dark theme</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <select
                className="neu-input w-full p-2 text-sm text-foreground"
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save className="w-4 h-4" />
            Save Preferences
          </Button>
          <Button
            variant="destructive"
            onClick={signOut}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <MobileNav />
    </div>
  );
};

export default Settings;
