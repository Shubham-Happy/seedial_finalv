
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function Notifications() {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    refreshNotifications 
  } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  // Notification time formatter
  const formatNotificationTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Notifications</h1>
        
        {notifications.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()}
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-start gap-4 p-4 border rounded-md" aria-busy="true" aria-label="Loading notification skeleton">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map(notification => {
            let icon;
            let bgColor = 'bg-muted';
            
            switch (notification.type) {
              case 'like':
                icon = <span className="text-red-500">❤️</span>;
                bgColor = 'bg-red-50';
                break;
              case 'comment':
                icon = <span>💬</span>;
                bgColor = 'bg-blue-50';
                break;
              case 'follow':
                icon = <span>👋</span>;
                bgColor = 'bg-green-50';
                break;
              case 'mention':
                icon = <span>@</span>;
                bgColor = 'bg-purple-50';
                break;
              case 'system':
                icon = <span>🔔</span>;
                bgColor = 'bg-yellow-50';
                break;
              case 'message':
                icon = <span>✉️</span>;
                bgColor = 'bg-indigo-50';
                break;
              default:
                icon = <Bell className="h-4 w-4" />;
            }
            
            return (
              <div 
                key={notification.id}
                className={`flex items-start gap-4 p-4 border rounded-md ${!notification.read ? 'bg-muted/20' : ''}`}
                onClick={() => !notification.read && markAsRead(notification.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") !notification.read && markAsRead(notification.id); }}
              >
                {notification.actor ? (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                    <AvatarFallback>
                      {notification.actor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`h-10 w-10 rounded-full ${bgColor} flex items-center justify-center`}>
                    {icon}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <div className="font-medium">
                      {notification.actor?.name || "System"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatNotificationTime(notification.time)}
                    </div>
                  </div>
                  
                  <p className="text-sm">
                    {notification.content}
                  </p>
                  
                  {!notification.read && (
                    <div className="mt-2">
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    </div>
                  )}
                </div>
                
                {notification.link && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild
                    className="ml-2 flex-shrink-0"
                  >
                    <Link to={notification.link}>View</Link>
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-md bg-muted/10">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">No notifications</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            When you get notifications, they'll appear here. Notifications include likes on your posts, new followers, and mentions.
          </p>
        </div>
      )}
    </div>
  );
}
