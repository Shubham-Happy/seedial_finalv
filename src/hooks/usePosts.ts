
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Profile } from "@/types/database";
import { fetchProfileById } from "@/lib/supabase-queries";

// Define types
export interface Comment {
  id: string;
  content: string;
  post_id: string;
  user_id: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
  replies?: Comment[];
}

export interface Reaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface Post {
  id: string;
  content: string;
  image_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
  reactions?: Reaction[];
  comments?: Comment[];
  commentCount?: number;
  userReaction?: string | null;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [postsData, setPostsData] = useState<Post[]>([]);

  const toggleExpandComments = (postId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const fetchPosts = async (): Promise<Post[]> => {
    const { data: posts, error } = await supabase
      .from("posts")
      .select(`
        *,
        reactions:post_reactions(*),
        comments:comments(*)
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Fetch user information for each post
    const postWithUsers = await Promise.all(
      posts.map(async (post) => {
        // Get user profile info using our helper function
        const profile = await fetchProfileById(post.user_id);
        
        // Count comments
        const commentCount = post.comments ? post.comments.length : 0;

        // Find user's reaction if logged in
        let userReaction = null;
        if (user) {
          userReaction = post.reactions?.find((r: Reaction) => r.user_id === user.id)?.reaction_type || null;
        }

        return {
          ...post,
          commentCount,
          userReaction,
          user: {
            id: post.user_id,
            name: profile?.full_name || profile?.username || "Anonymous",
            avatar: profile?.avatar_url
          }
        };
      })
    );

    return postWithUsers;
  };

  const createPostMutation = useMutation({
    mutationFn: async ({ content, imageFile }: { content: string, imageFile: File | null }) => {
      if (!user) throw new Error("You must be logged in to create a post");

      // Upload image if one is provided
      let image_url = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        image_url = urlData.publicUrl;
      }

      // Create post
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { content, image_url, user_id: user.id }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been created.",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, content, imageFile }: { postId: string, content: string, imageFile: File | null }) => {
      if (!user) throw new Error("You must be logged in to update a post");

      // Get the existing post to check ownership
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('user_id, image_url')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      
      // Verify ownership
      if (existingPost.user_id !== user.id) {
        throw new Error("You can only edit your own posts");
      }

      // Prepare update data
      const updateData: { content: string, image_url?: string | null } = { content };

      // Handle image
      if (imageFile) {
        // Upload new image
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post_images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('post_images')
          .getPublicUrl(filePath);

        updateData.image_url = urlData.publicUrl;
      }

      // Update post
      const { data, error } = await supabase
        .from('posts')
        .update(updateData)
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("You must be logged in to delete a post");

      // Get the existing post to check ownership
      const { data: existingPost, error: fetchError } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

      if (fetchError) throw fetchError;
      
      // Verify ownership
      if (existingPost.user_id !== user.id) {
        throw new Error("You can only delete your own posts");
      }

      // Delete post
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      return postId;
    },
    onSuccess: (deletedPostId) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your post has been deleted.",
      });
    },
    onError: (error) => {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  });

  const toggleReactionMutation = useMutation({
    mutationFn: async (params: { postId: string, reactionType: string }) => {
      const { postId, reactionType } = params;
      if (!user) throw new Error("You must be logged in to react to posts");

      // Check if user already has a reaction
      const { data: existingReaction, error: findError } = await supabase
        .from('post_reactions')
        .select()
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (findError) throw findError;

      if (existingReaction) {
        // If clicking the same reaction, remove it
        if (existingReaction.reaction_type === reactionType) {
          const { error: deleteError } = await supabase
            .from('post_reactions')
            .delete()
            .eq('id', existingReaction.id);

          if (deleteError) throw deleteError;
          return { action: 'removed', reactionType };
        } else {
          // If changing reaction type, update it
          const { error: updateError } = await supabase
            .from('post_reactions')
            .update({ reaction_type: reactionType })
            .eq('id', existingReaction.id);

          if (updateError) throw updateError;
          return { action: 'updated', reactionType };
        }
      } else {
        // Create new reaction
        const { error: insertError } = await supabase
          .from('post_reactions')
          .insert([
            { post_id: postId, user_id: user.id, reaction_type: reactionType }
          ]);

        if (insertError) throw insertError;
        return { action: 'added', reactionType };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error toggling reaction:", error);
      toast({
        title: "Error",
        description: "Failed to update reaction. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createCommentMutation = useMutation({
    mutationFn: async (params: { postId: string, content: string }) => {
      const { postId, content } = params;
      if (!user) throw new Error("You must be logged in to comment");

      const { data, error } = await supabase
        .from('comments')
        .insert([
          { post_id: postId, user_id: user.id, content }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your comment has been added.",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createReplyMutation = useMutation({
    mutationFn: async (params: { commentId: string, content: string, postId: string }) => {
      const { commentId, content, postId } = params;
      if (!user) throw new Error("You must be logged in to reply");

      const { data, error } = await supabase
        .from('comments')
        .insert([
          { post_id: postId, parent_id: commentId, user_id: user.id, content }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Success",
        description: "Your reply has been added.",
      });
    },
    onError: (error) => {
      console.error("Error creating reply:", error);
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    }
  });

  const createPost = useCallback(async (content: string, imageFile: File | null): Promise<void> => {
    await createPostMutation.mutateAsync({ content, imageFile });
  }, [createPostMutation]);

  const updatePost = useCallback(async (postId: string, content: string, imageFile: File | null): Promise<void> => {
    await updatePostMutation.mutateAsync({ postId, content, imageFile });
  }, [updatePostMutation]);

  const deletePost = useCallback(async (postId: string): Promise<void> => {
    await deletePostMutation.mutateAsync(postId);
  }, [deletePostMutation]);

  const toggleReaction = useCallback(async (postId: string, reactionType: string): Promise<void> => {
    await toggleReactionMutation.mutateAsync({ postId, reactionType });
  }, [toggleReactionMutation]);

  const createComment = useCallback(async (postId: string, content: string): Promise<void> => {
    await createCommentMutation.mutateAsync({ postId, content });
  }, [createCommentMutation]);

  const createReply = useCallback(async (commentId: string, content: string, postId: string): Promise<void> => {
    await createReplyMutation.mutateAsync({ commentId, content, postId });
  }, [createReplyMutation]);

  // Get posts from the query
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts
  });

  return {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
    toggleReaction,
    createComment,
    createReply,
    expandedComments,
    toggleExpandComments,
  };
}
