
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Types
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
}

export interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  status: string;
}

export interface Conversation {
  id: string;
  user: User;
  lastMessage: {
    text: string;
    time: string;
    isRead: boolean;
    isSent: boolean;
  };
  unread: number;
}

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        
        if (session) {
          setCurrentUserId(session.user.id);
        } else {
          console.log("No active session found");
        }
      } catch (err) {
        console.error("Error fetching user session:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      }
    };
    
    fetchUser();
  }, []);

  // Fetch conversations with better error handling
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return;
    
    setIsLoading(true);
    try {
      // Get all conversations where the current user is involved
      const { data: conversationsData, error: convError } = await supabase
        .from('conversations')
        .select(`
          id,
          user1_id,
          user2_id,
          last_message_text,
          last_message_time,
          last_message_sender_id,
          unread_count
        `)
        .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
        .order('last_message_time', { ascending: false });
      
      if (convError) throw convError;
      
      if (conversationsData) {
        // Get profile data for all users involved in conversations
        const otherUserIds = conversationsData.map(conv => 
          conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id
        );
        
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, status')
          .in('id', otherUserIds);
          
        if (profilesError) throw profilesError;
        
        // Create a map of user profiles for quick lookup
        const userProfiles = new Map();
        profilesData?.forEach(profile => {
          userProfiles.set(profile.id, {
            id: profile.id,
            name: profile.full_name || 'Unknown User',
            avatar: profile.avatar_url || '',
            status: profile.status || 'offline'
          });
        });
        
        // Transform data to match our Conversation interface
        const formattedConversations: Conversation[] = conversationsData.map(conv => {
          const otherUserId = conv.user1_id === currentUserId ? conv.user2_id : conv.user1_id;
          const otherUser = userProfiles.get(otherUserId) || {
            id: otherUserId,
            name: 'Unknown User',
            avatar: '',
            status: 'offline'
          };
          
          return {
            id: conv.id,
            user: otherUser,
            lastMessage: {
              text: conv.last_message_text || 'Start a conversation',
              time: conv.last_message_time 
                ? new Date(conv.last_message_time).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  }) 
                : '',
              isRead: conv.unread_count === 0,
              isSent: conv.last_message_sender_id === currentUserId
            },
            unread: conv.unread_count || 0
          };
        });
        
        setConversations(formattedConversations);
        
        // Set active conversation if none is selected
        if (!activeConversation && formattedConversations.length > 0) {
          const firstConv = formattedConversations[0];
          setActiveConversation(firstConv);
          
          // Load messages for first conversation
          loadMessages(firstConv.id, firstConv.user.id).catch(err => 
            console.error("Error loading messages for first conversation:", err)
          );
        }
      }
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err instanceof Error ? err : new Error('Failed to load conversations'));
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId, activeConversation]);

  // Load messages for a conversation with improved error handling
  const loadMessages = async (conversationId: string, recipientId: string) => {
    if (!currentUserId) return;
    
    try {
      // Mark messages as read when conversation is selected
      await markConversationAsRead(conversationId);
      
      // Get messages between the current user and recipient with better query
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUserId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${currentUserId})`)
        .order('time', { ascending: true });
      
      if (error) throw error;
      
      // Format messages
      const formattedMessages: Message[] = (data || []).map((msg) => ({
        id: msg.id,
        sender: msg.sender_id,
        text: msg.text,
        time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: msg.status
      }));
      
      setMessages(formattedMessages);
      
      // Set up subscription to messages channel
      const messagesChannel = supabase.channel(`messages-${conversationId}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id=eq.${currentUserId},recipient_id=eq.${recipientId}),and(sender_id=eq.${recipientId},recipient_id=eq.${currentUserId}))`
        }, payload => {
          console.log("New message received:", payload);
          const msg = payload.new as any;
          const newMessage: Message = {
            id: msg.id,
            sender: msg.sender_id,
            text: msg.text,
            time: new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: msg.status
          };
            
          setMessages(prev => [...prev, newMessage]);
            
          // If message is received, mark conversation as read
          if (msg.sender_id === recipientId) {
            markConversationAsRead(conversationId);
            setIsComposing(false);
          }
        })
        .subscribe();
      
      console.log("Subscribed to messages channel:", `messages-${conversationId}`);
      
      return () => {
        supabase.removeChannel(messagesChannel);
      };
    } catch (err) {
      console.error("Error loading messages:", err);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mark conversation as read with error handling
  const markConversationAsRead = async (conversationId: string) => {
    if (!currentUserId) return;
    
    try {
      // Update local state first for immediate feedback
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread: 0, lastMessage: { ...conv.lastMessage, isRead: true } } 
            : conv
        )
      );
      
      // Use the database function to mark messages as read
      const { error } = await supabase.rpc('mark_conversation_read', {
        conversation_uuid: conversationId,
        user_uuid: currentUserId
      });
      
      if (error) throw error;
    } catch (err) {
      console.error("Error marking conversation as read:", err);
      // Silently fail - no need to show error to user for this operation
    }
  };

  // Send message with improved error handling
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !currentUserId) return;
    
    const messageText = newMessage.trim();
    setNewMessage(""); // Clear input immediately for better UX
    
    const optimisticId = `temp-${Date.now()}`;
    const now = new Date();
    
    // Add optimistic message to the UI
    setMessages(prev => [
      ...prev, 
      {
        id: optimisticId,
        sender: currentUserId,
        text: messageText,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending'
      }
    ]);
    
    try {
      // Send message to database
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          recipient_id: activeConversation.user.id,
          text: messageText,
          time: now.toISOString(),
          status: 'sent'
        })
        .select('*')
        .single();
      
      if (messageError) throw messageError;
      
      // Update local messages with real message data
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticId 
            ? {
                id: messageData.id,
                sender: messageData.sender_id,
                text: messageData.text,
                time: new Date(messageData.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: messageData.status
              } 
            : msg
        )
      );
      
      // The conversation will be updated automatically via the database trigger and realtime subscription
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Update the optimistic message to show error state
      setMessages(prev => 
        prev.map(msg => 
          msg.id === optimisticId 
            ? { ...msg, status: 'error' } 
            : msg
        )
      );
      
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create a new conversation with improved error handling
  const handleNewConversation = async () => {
    if (!currentUserId) {
      toast({
        title: "Not authenticated",
        description: "You must be logged in to start a conversation.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Get a random user to start conversation with (for demo purposes)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url, status')
        .neq('id', currentUserId)
        .limit(1);
        
      if (usersError) throw usersError;
      
      if (!usersData || usersData.length === 0) {
        throw new Error("No other users found to start conversation with");
      }
      
      const otherUser = usersData[0];
      
      // Check if conversation already exists
      const { data: existingConv, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${currentUserId},user2_id.eq.${otherUser.id}),and(user1_id.eq.${otherUser.id},user2_id.eq.${currentUserId})`)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let conversationId: string;
      
      if (existingConv) {
        // Use existing conversation
        conversationId = existingConv.id;
      } else {
        // Create new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: currentUserId < otherUser.id ? currentUserId : otherUser.id,
            user2_id: currentUserId < otherUser.id ? otherUser.id : currentUserId,
            last_message_text: null,
            last_message_time: null,
            last_message_sender_id: null,
            unread_count: 0
          })
          .select()
          .single();
          
        if (createError) throw createError;
        if (!newConv) throw new Error("Failed to create conversation");
        
        conversationId = newConv.id;
      }
      
      // Create conversation object for UI
      const conversationForUI: Conversation = {
        id: conversationId,
        user: {
          id: otherUser.id,
          name: otherUser.full_name || 'User',
          avatar: otherUser.avatar_url || '',
          status: otherUser.status || 'offline',
        },
        lastMessage: {
          text: "Start a conversation",
          time: "",
          isRead: true,
          isSent: false,
        },
        unread: 0,
      };
      
      // Set as active conversation
      setActiveConversation(conversationForUI);
      setMessages([]);
      
      // Refresh conversations list
      await fetchConversations();
      
      toast({
        title: "New conversation created",
        description: "You can now start chatting.",
      });
    } catch (err) {
      console.error("Error creating conversation:", err);
      toast({
        title: "Error",
        description: "Failed to create new conversation. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Select a conversation
  const handleSelectConversation = (conv: Conversation) => {
    setActiveConversation(conv);
    loadMessages(conv.id, conv.user.id).catch(err => 
      console.error("Error loading messages for selected conversation:", err)
    );
  };

  // Load conversations when currentUserId changes
  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
      
      // Set up subscription for conversation updates
      const conversationsChannel = supabase.channel('conversations-changes')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `or(user1_id=eq.${currentUserId},user2_id=eq.${currentUserId})`
        }, () => {
          console.log("Conversations changed, refreshing...");
          fetchConversations();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(conversationsChannel);
      };
    }
  }, [currentUserId, fetchConversations]);

  // Filter conversations by search
  const filteredConversations = conversations.filter(conv => 
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    conversations: filteredConversations,
    activeConversation: activeConversation,
    messages,
    newMessage,
    searchQuery,
    setSearchQuery,
    setNewMessage,
    isComposing,
    isLoading,
    error,
    handleSendMessage,
    handleNewConversation,
    handleSelectConversation,
    // Expose setter functions and fetch for page updates
    setActiveConversation,
    setMessages,
    fetchConversations,
  };
};
