import { Home, Video, BarChart3, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const MobileNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 neu-card border-t border-border z-50">
      <div className="grid grid-cols-4 h-16">
        <Link
          to="/home"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive("/home")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive("/dashboard")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="w-5 h-5" />
          <span className="text-xs">Live</span>
        </Link>
        
        <Link
          to="/recordings"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive("/recordings")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs">Analysis</span>
        </Link>
        
        <Link
          to="/settings"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive("/settings") || isActive("/profile")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">Settings</span>
        </Link>
      </div>
    </nav>
  );
};
