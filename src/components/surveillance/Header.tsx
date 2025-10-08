import { Bell, Settings as SettingsIcon, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import vigilFlowLogo from "@/assets/vigil-flow-logo.png";
export const Header = () => {
  const navigate = useNavigate();
  return <header className="neu-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer" onClick={() => navigate("/home")}>
            <div className="p-1.5 sm:p-2 rounded-xl animate-scale-in shrink-0" style={{
            background: 'linear-gradient(135deg, hsl(214 90% 60%), hsl(270 70% 65%))'
          }}>
              <img src={vigilFlowLogo} alt="Vigil Flow" className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent truncate">Shadowbyte</h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">AI Security Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <div className="hidden lg:flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 neu-card-pressed rounded-lg">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-success rounded-full animate-pulse" />
              <span className="text-[10px] sm:text-xs font-medium text-success whitespace-nowrap">System Active</span>
            </div>

            <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
              <Badge className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center p-0 bg-destructive text-[8px] sm:text-[10px]">
                3
              </Badge>
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => navigate("/settings")}>
              <SettingsIcon className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </Button>

            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => navigate("/profile")}>
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" />
            </Button>
          </div>
        </div>
      </div>
    </header>;
};