
import React from "react";
import { Phone, Video, Info, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { User } from "@/hooks/useMessages";

interface MessageHeaderProps {
  user: User;
  className?: string;
}

export function MessageHeader({ user, className }: MessageHeaderProps) {
  return (
    <div className={`p-4 border-b flex items-center justify-between ${className || ""}`}>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-xs text-muted-foreground">
            {user.status === "online" ? (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></span>
                Online
              </span>
            ) : user.status === "away" ? (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-1.5"></span>
                Away
              </span>
            ) : (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-muted mr-1.5"></span>
                Offline
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" onClick={() => toast({
          title: "Audio call",
          description: "Feature coming soon: Audio calls",
        })}>
          <Phone className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => toast({
          title: "Video call",
          description: "Feature coming soon: Video calls",
        })}>
          <Video className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => toast({
          title: "Conversation info",
          description: "Feature coming soon: View conversation details",
        })}>
          <Info className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Mute conversation</DropdownMenuItem>
            <DropdownMenuItem>Search in conversation</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Block user</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
