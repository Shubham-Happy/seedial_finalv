
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface User {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  skills?: string[];
  followers?: number;
  following?: number;
  isFollowing?: boolean;
}

export const fetchPeople = async (): Promise<User[]> => {
  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error("Error fetching profiles:", error);
      throw error;
    }
    
    // Get current user
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    
    // Get follow counts and status for each profile
    const usersWithFollowData = await Promise.all(profiles.map(async (profile) => {
      // Get follower count using a raw query instead of RPC
      const { data: followerData, error: followerError } = await supabase
        .from('follows')
        .select('id')
        .eq('following_id', profile.id);
      
      const followerCount = followerData?.length || 0;
      
      // Get following count using a raw query instead of RPC
      const { data: followingData, error: followingError } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', profile.id);
        
      const followingCount = followingData?.length || 0;
        
      // Check if current user is following this profile
      let isFollowing = false;
      if (currentUserId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', profile.id)
          .maybeSingle();
        
        isFollowing = !!followData;
      }
      
      return {
        id: profile.id,
        name: profile.full_name || profile.username || "User",
        username: profile.username,
        avatar: profile.avatar_url,
        headline: profile.status || "", // Using status as headline
        bio: "",
        location: "",
        website: "",
        skills: [],
        followers: followerCount,
        following: followingCount,
        isFollowing
      };
    }));
    
    return usersWithFollowData;
  } catch (error) {
    console.error("Error fetching people:", error);
    return [];
  }
};

export const followUser = async (userId: string): Promise<boolean> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow users.",
        variant: "destructive",
      });
      return false;
    }
    
    const currentUserId = session.user.id;
    
    if (userId === currentUserId) {
      toast({
        title: "Cannot follow yourself",
        description: "You cannot follow your own profile.",
        variant: "destructive",
      });
      return false;
    }
    
    // Check if already following
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUserId)
      .eq('following_id', userId)
      .maybeSingle();

    if (existingFollow) {
      // Unfollow
      const { error: unfollowError } = await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', userId);
        
      if (unfollowError) throw unfollowError;
      
      toast({
        title: "Unfollowed",
        description: "You are no longer following this user.",
      });
      
      return false;
    } else {
      // Follow
      const { error: followError } = await supabase
        .from('follows')
        .insert({
          follower_id: currentUserId,
          following_id: userId
        });
        
      if (followError) throw followError;
      
      toast({
        title: "Following",
        description: "You are now following this user.",
      });
      
      return true;
    }
  } catch (error) {
    console.error(`Error following user ${userId}:`, error);
    
    toast({
      title: "Failed to follow",
      description: "An error occurred. Please try again.",
      variant: "destructive",
    });
    
    return false;
  }
};
