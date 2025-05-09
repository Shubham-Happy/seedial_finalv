
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/hooks/usePosts";
import { formatDistanceToNow } from "date-fns";
import { Reply } from "lucide-react";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCreateComment: (postId: string, content: string) => Promise<void>;
  onCreateReply: (commentId: string, content: string, postId: string) => Promise<void>;
}

export function CommentSection({ 
  postId, 
  comments, 
  onCreateComment,
  onCreateReply 
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreateComment(postId, newComment);
      setNewComment("");
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      setIsSubmitting(true);
      await onCreateReply(commentId, replyContent, postId);
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error creating reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartReply = (commentId: string) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyContent("");
  };

  // Filter top-level comments (no parent_id)
  const topLevelComments = comments.filter(comment => !comment.parent_id);
  
  // Function to get replies for a comment
  const getRepliesForComment = (commentId: string) => {
    return comments.filter(comment => comment.parent_id === commentId);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmitComment} className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Write a comment..."
            className="resize-none min-h-[60px]"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button 
              type="submit" 
              size="sm"
              disabled={!newComment.trim() || isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
      </form>

      <div className="space-y-4 pl-2">
        {topLevelComments.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user?.avatar || ""} />
                <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-start">
                    <div className="font-medium text-sm">{comment.user?.name || "Unknown User"}</div>
                    <div className="text-xs text-muted-foreground">
                      {comment.created_at ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true }) : ""}
                    </div>
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs mt-1"
                  onClick={() => handleStartReply(comment.id)}
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>
                
                {replyingTo === comment.id && (
                  <div className="mt-2">
                    <Textarea
                      placeholder="Write a reply..."
                      className="resize-none min-h-[60px] text-sm"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button 
                        type="button" 
                        size="sm"
                        variant="outline"
                        onClick={() => setReplyingTo(null)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || isSubmitting}
                      >
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Display replies */}
                {getRepliesForComment(comment.id).length > 0 && (
                  <div className="ml-4 mt-2 space-y-2">
                    {getRepliesForComment(comment.id).map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={reply.user?.avatar || ""} />
                          <AvatarFallback>{reply.user?.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted p-2 rounded-md">
                            <div className="flex justify-between items-start">
                              <div className="font-medium text-xs">{reply.user?.name || "Unknown User"}</div>
                              <div className="text-xs text-muted-foreground">
                                {reply.created_at ? formatDistanceToNow(new Date(reply.created_at), { addSuffix: true }) : ""}
                              </div>
                            </div>
                            <p className="text-xs mt-1">{reply.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {topLevelComments.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
