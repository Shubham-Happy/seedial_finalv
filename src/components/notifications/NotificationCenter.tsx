
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck, UserPlus, Heart, MessageSquare, AtSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "@/hooks/use-toast";

export function NotificationCenter() {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead,
    refreshNotifications
  } = useNotifications();

  // Fetch notifications when the component mounts
  useEffect(() => {
    refreshNotifications().catch(error => {
      console.error("Failed to fetch notifications:", error);
      toast({
        title: "Error",
        description: "Failed to load notifications. Please try again later.",
        variant: "destructive"
      });
    });
  }, [refreshNotifications]);

  // Function to render notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'follow':
        return <UserPlus className="h-4 w-4 text-green-500" />;
      case 'mention':
        return <AtSign className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-amber-500" />;
    }
  };

  // Function to format the notification time
  const formatNotificationTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // less than a day
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else if (diffInMinutes < 10080) { // less than a week
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="flex items-start gap-4 p-4 border rounded-md">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-10" />
              </div>
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications && notifications.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Recent Notifications</h2>
            {notifications.some(n => !n.read) && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                <span>Mark all as read</span>
              </Button>
            )}
          </div>
          
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`flex items-start gap-4 p-4 border rounded-md ${!notification.read ? 'bg-muted/20' : ''}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              {notification.actor ? (
                <Avatar>
                  <AvatarImage src={notification.actor.avatar} alt={notification.actor.name} />
                  <AvatarFallback>
                    {notification.actor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                  {getNotificationIcon(notification.type)}
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="font-medium">
                    {notification.actor?.name || "System"}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatNotificationTime(notification.time)}
                  </div>
                </div>
                
                <p className="text-sm my-1">
                  {notification.content}
                </p>
                
                {notification.link && (
                  <Link 
                    to={notification.link} 
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View details
                  </Link>
                )}
                
                {!notification.read && (
                  <Badge variant="secondary" className="mt-2 text-xs">New</Badge>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-center py-12 border rounded-md bg-muted/10">
          <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-medium mb-2">You're all caught up</h2>
          <p className="text-muted-foreground">
            You have no new notifications at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
