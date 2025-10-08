import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Info, Lightbulb, Sparkles } from "lucide-react";

interface TooltipHelperProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  title: string;
  description: string;
  icon?: "help" | "info" | "lightbulb" | "sparkles";
}

export const TooltipHelper = ({ 
  position, 
  title, 
  description,
  icon = "help" 
}: TooltipHelperProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = () => {
    switch (icon) {
      case "info":
        return <Info className="w-4 h-4 text-primary" />;
      case "lightbulb":
        return <Lightbulb className="w-4 h-4 text-warning" />;
      case "sparkles":
        return <Sparkles className="w-4 h-4 text-accent" />;
      default:
        return <HelpCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip open={isOpen} onOpenChange={setIsOpen}>
        <TooltipTrigger asChild>
          <button
            className={`tooltip-icon tooltip-${position} hidden lg:flex items-center justify-center`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {getIcon()}
          </button>
        </TooltipTrigger>
        <TooltipContent 
          side={position.includes("top") ? "bottom" : "top"}
          align={position.includes("left") ? "start" : "end"}
          className="neu-card max-w-xs p-4"
        >
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">{title}</h4>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
