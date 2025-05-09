
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreatePostForm } from "@/components/posts/CreatePostForm";
import { usePosts } from "@/hooks/usePosts";
import { ABTestedPostList } from "@/components/posts/ABTestedPostList";

export default function Posts() {
  const { 
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    createComment,
    createReply
  } = usePosts();

  // Wrapper for createPost to match expected type
  const handleCreatePost = async (content: string, imageFile: File | null) => {
    await createPost(content, imageFile);
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 space-y-6">
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <CreatePostForm onCreatePost={handleCreatePost} />
          </CardContent>
        </Card>
        
        <ScrollArea className="h-[calc(100vh-300px)]">
          <ABTestedPostList 
            posts={posts}
            isLoading={isLoading}
            onToggleReaction={toggleReaction}
            onCreateComment={createComment}
            onCreateReply={createReply}
            onUpdatePost={updatePost}
            onDeletePost={deletePost}
          />
        </ScrollArea>
      </div>
    </div>
  );
}
