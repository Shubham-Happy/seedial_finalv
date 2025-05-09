
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/hooks/useMessages";
import { Skeleton } from "@/components/ui/skeleton";

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation?: Conversation;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  activeConversation,
  searchQuery,
  setSearchQuery,
  onSelectConversation,
  isLoading = false
}: ConversationListProps) {
  if (isLoading) {
    return (
      <>
        <div className="relative p-4">
          <Skeleton className="h-10 w-full" />
        </div>
        
        <div className="h-[calc(100%-130px)] overflow-y-auto">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 hover:bg-muted/50">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="relative p-4">
        <Search className="absolute left-7 top-7 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search messages..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="h-[calc(100%-130px)] overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-start gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                activeConversation?.id === conv.id ? "bg-muted" : ""
              }`}
              onClick={() => onSelectConversation(conv)}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                  <AvatarFallback>{conv.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                    conv.user.status === "online"
                      ? "bg-green-500"
                      : conv.user.status === "away"
                      ? "bg-yellow-500"
                      : "bg-muted"
                  }`}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <h4 className="font-medium truncate">{conv.user.name}</h4>
                  <span className="text-xs text-muted-foreground">{conv.lastMessage.time}</span>
                </div>
                
                <p className={`text-sm truncate ${conv.unread > 0 ? "font-medium" : "text-muted-foreground"}`}>
                  {conv.lastMessage.isSent && "You: "}
                  {conv.lastMessage.text}
                </p>
              </div>
              
              {conv.unread > 0 && (
                <Badge className="rounded-full">{conv.unread}</Badge>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No conversations found</p>
          </div>
        )}
      </div>
    </>
  );
}
