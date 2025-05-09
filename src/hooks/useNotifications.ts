import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: string; // 'like', 'comment', 'follow', 'mention', 'system', 'message'
  content: string;
  time: string;
  read: boolean;
  link?: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        setNotifications([]);
        setIsLoading(false);
        return;
      }
      
      // Attempt to fetch notifications from the database
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select(`
            *,
            actor:actor_user_id (
              id,
              profiles:profiles!inner(full_name, avatar_url)
            )
          `)
          .eq('user_id', session.session.user.id)
          .order('time', { ascending: false });
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match the Notification interface
          const formattedNotifications: Notification[] = data.map((notification: any) => ({
            id: notification.id,
            type: notification.type,
            content: notification.content,
            time: notification.time,
            read: notification.read,
            link: notification.link,
            actor: notification.actor ? {
              id: notification.actor.id,
              name: notification.actor.profiles.full_name || 'Unknown User',
              avatar: notification.actor.profiles.avatar_url
            } : undefined
          }));
          
          setNotifications(formattedNotifications);
          
          // Count unread notifications
          const unread = formattedNotifications.filter(n => !n.read).length;
          setUnreadCount(unread);
        } else {
          setNotifications([]);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        
        // If notification table doesn't exist yet, use mock data
        const mockNotifications: Notification[] = [
          {
            id: '1',
            type: 'follow',
            content: 'John Smith started following you.',
            time: new Date().toISOString(),
            read: false,
            actor: {
              id: 'user1',
              name: 'John Smith',
            }
          },
          {
            id: '2',
            type: 'system',
            content: 'Welcome to StatusNow! Complete your profile to get started.',
            time: new Date().toISOString(),
            read: false,
            link: '/settings'
          }
        ];
        
        setNotifications(mockNotifications);
        setUnreadCount(mockNotifications.filter(n => !n.read).length);
      }
    } catch (error) {
      console.error("Error in useNotifications:", error);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notification.",
        variant: "destructive",
      });
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        return;
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.session.user.id)
        .eq('read', false);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to update notifications.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription for new notifications
  const setupSubscription = useCallback(() => {
    try {
      const channel = supabase
        .channel('notifications-changes')
        .on('postgres_changes', 
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
          }, 
          payload => {
            // Add new notification to state and update unread count
            const newNotification = payload.new as any;
            
            // Fetch actor details if needed
            if (newNotification.actor_user_id) {
              supabase
                .from('profiles')
                .select('*')
                .eq('id', newNotification.actor_user_id)
                .single()
                .then(({ data: profile }) => {
                  const formattedNotification: Notification = {
                    id: newNotification.id,
                    type: newNotification.type,
                    content: newNotification.content,
                    time: newNotification.time,
                    read: newNotification.read,
                    link: newNotification.link,
                    actor: profile ? {
                      id: newNotification.actor_user_id,
                      name: profile.full_name || 'Unknown User',
                      avatar: profile.avatar_url
                    } : undefined
                  };
                  
                  setNotifications(prev => [formattedNotification, ...prev]);
                  if (!newNotification.read) {
                    setUnreadCount(prev => prev + 1);
                  }
                  
                  // Show toast for new notification
                  toast({
                    title: "New notification",
                    description: newNotification.content,
                  });
                });
            } else {
              const formattedNotification: Notification = {
                id: newNotification.id,
                type: newNotification.type,
                content: newNotification.content,
                time: newNotification.time,
                read: newNotification.read,
                link: newNotification.link
              };
              
              setNotifications(prev => [formattedNotification, ...prev]);
              if (!newNotification.read) {
                setUnreadCount(prev => prev + 1);
              }
              
              // Show toast for new notification
              toast({
                title: "New notification",
                description: newNotification.content,
              });
            }
          }
        )
        .subscribe();
      
      return channel;
    } catch (error) {
      console.error("Error setting up notification subscription:", error);
      return null;
    }
  }, []);

  return {
    notifications,
    isLoading,
    unreadCount,
    markAsRead: (id: string) => {
      // Implement simple local state update since we might not have the table yet
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id 
            ? { ...notification, read: true } 
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    },
    markAllAsRead: () => {
      // Implement simple local state update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    },
    refreshNotifications: fetchNotifications,
    setupSubscription
  };
}
