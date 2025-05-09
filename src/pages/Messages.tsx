
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageHeader } from "@/components/messages/MessageHeader";
import { MessageList } from "@/components/messages/MessageList";
import { MessageInput } from "@/components/messages/MessageInput";
import { useMessages, Conversation } from "@/hooks/useMessages";
import { PenSquare, Inbox, Archive, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Messages() {
  const {
    conversations,
    activeConversation,
    messages,
    newMessage,
    searchQuery,
    setSearchQuery,
    setNewMessage,
    isComposing,
    isLoading,
    handleSendMessage,
    handleNewConversation,
    handleSelectConversation,
    setActiveConversation,
    setMessages,
    fetchConversations
  } = useMessages();
  
  const location = useLocation();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle direct message link from a profile page
  useEffect(() => {
    const handleDirectMessage = async () => {
      if (isProcessing) return;
      
      if (location.state?.conversationId || location.state?.recipientId) {
        setIsProcessing(true);
        try {
          const { conversationId, recipientId, recipientName, recipientAvatar } = location.state;
          
          // Get current user first
          const { data: sessionData } = await supabase.auth.getSession();
          if (!sessionData?.session) {
            toast({
              title: "Authentication required",
              description: "You must be logged in to send messages",
              variant: "destructive",
            });
            return;
          }
          
          setCurrentUserId(sessionData.session.user.id);
          
          // Wait for conversations to load
          if (isLoading) {
            // This will trigger the effect again when isLoading becomes false
            return;
          }
          
          // Find the conversation in the list or create a representation of it
          const existingConv = conversations.find(conv => 
            conv.id === conversationId || 
            (conv.user.id === recipientId && recipientId)
          );
          
          if (existingConv) {
            // If conversation exists in the list, select it
            handleSelectConversation(existingConv);
          } else if (recipientId && recipientName) {
            // If conversation doesn't exist yet (newly created), create a temporary representation
            const tempConversation: Conversation = {
              id: conversationId || `temp-${recipientId}`,
              user: {
                id: recipientId,
                name: recipientName || "User",
                avatar: recipientAvatar || "",
                status: "offline"
              },
              lastMessage: {
                text: "Start a conversation",
                time: "",
                isRead: true,
                isSent: false
              },
              unread: 0
            };
            
            setActiveConversation(tempConversation);
            setMessages([]);
          }
          
          // Refresh conversations to get the actual data
          await fetchConversations();
        } catch (error) {
          console.error("Error handling direct message:", error);
          toast({
            title: "Error",
            description: "Failed to start conversation. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsProcessing(false);
        }
      }
    };
    
    handleDirectMessage();
  }, [location.state, conversations, isLoading, handleSelectConversation, setActiveConversation, setMessages, fetchConversations]);
  
  // Get current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id) {
          setCurrentUserId(session.user.id);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    
    getCurrentUser();
  }, []);

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <div className="flex flex-col md:flex-row bg-background border rounded-lg overflow-hidden h-[calc(100vh-150px)]">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-r">
          <div className="p-4 border-b flex justify-between items-center">
            <h1 className="text-xl font-bold">Messages</h1>
            <Button size="sm" onClick={handleNewConversation}>
              <PenSquare className="h-4 w-4 mr-2" />
              Compose
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <div className="px-2 pt-2">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">
                  <Inbox className="h-4 w-4 mr-2" /> All
                </TabsTrigger>
                <TabsTrigger value="starred">
                  <Star className="h-4 w-4 mr-2" /> Starred
                </TabsTrigger>
                <TabsTrigger value="archived">
                  <Archive className="h-4 w-4 mr-2" /> Archived
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
          
          <ScrollArea className="h-[calc(100vh-270px)]">
            <ConversationList 
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleSelectConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isLoading={isLoading}
            />
          </ScrollArea>
        </div>
        
        {/* Main message area */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <MessageHeader user={activeConversation.user} />
              <MessageList 
                messages={messages} 
                currentUserId={currentUserId || ""} 
                recipientUser={activeConversation.user}
                isComposing={isComposing}
              />
              <MessageInput 
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <PenSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground max-w-sm mb-6">
                Choose an existing conversation or start a new one to begin messaging
              </p>
              <Button onClick={handleNewConversation}>
                <PenSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
