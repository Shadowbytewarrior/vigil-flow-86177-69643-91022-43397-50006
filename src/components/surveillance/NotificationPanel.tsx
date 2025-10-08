import { Bell, Check, X, AlertTriangle, Info } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "info" | "warning" | "success";
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock notifications - replace with real data later
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Motion Detected",
    message: "Camera 3 detected unusual movement in sector B",
    type: "alert",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "2",
    title: "System Update",
    message: "AI analysis model updated successfully",
    type: "success",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Low Storage Warning",
    message: "Storage capacity at 85%. Consider archiving old footage",
    type: "warning",
    timestamp: "3 hours ago",
    read: true,
  },
];

export const NotificationPanel = ({ open, onOpenChange }: NotificationPanelProps) => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />;
      case "success":
        return <Check className="w-5 h-5 sm:w-6 sm:h-6 text-success" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />;
      case "info":
        return <Info className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />;
    }
  };

  const markAllAsRead = () => {
    // TODO: Implement mark all as read functionality
    console.log("Mark all as read");
  };

  const clearAll = () => {
    // TODO: Implement clear all functionality
    console.log("Clear all notifications");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 sm:px-6 py-4 sm:py-5 border-b flex-shrink-0">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="h-5 sm:h-6 min-w-5 sm:min-w-6 px-1.5 text-xs rounded-full">
                  {unreadCount}
                </Badge>
              )}
            </SheetTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs sm:text-sm h-8 px-2 sm:px-3 whitespace-nowrap"
            >
              Mark all read
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 px-4 sm:px-6 py-4">
          <div className="space-y-2 sm:space-y-3 pb-20">
            {mockNotifications.length === 0 ? (
              <div className="text-center py-12 sm:py-16 text-muted-foreground">
                <Bell className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No notifications</p>
              </div>
            ) : (
              mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? "bg-background border-border"
                      : "bg-muted/30 border-border"
                  }`}
                >
                  <div className="flex gap-2 sm:gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm sm:text-base leading-tight">
                          {notification.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 sm:h-7 sm:w-7 flex-shrink-0 -mt-1 -mr-1"
                          onClick={() => console.log("Delete", notification.id)}
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {mockNotifications.length > 0 && (
          <div className="flex-shrink-0 p-4 sm:p-6 border-t bg-background">
            <Button
              variant="outline"
              className="w-full h-10 sm:h-11 text-sm sm:text-base"
              onClick={clearAll}
            >
              Clear All Notifications
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
