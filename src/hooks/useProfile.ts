
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";
import { Profile } from "@/types/database";

export interface Education {
  id: string;
  school: string;
  degree: string;
  logo?: string;
  startYear: string;
  endYear: string;
  description?: string;
  activities?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  logo?: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  achievements?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expires: string | null;
}

export interface UserProfile {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  coverImage?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  // phone?: string; // Added phone field
  joined: string;
  followers: number;
  following: number;
  articles: number;
  skills?: string[];
  experience?: Experience[];
  education?: Education[];
  certifications?: Certification[];
}

export const useProfile = (userId?: string) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      
      try {
        // Get current logged-in user
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        // Determine which user to fetch
        const targetUserId = userId || currentUserId;
        
        if (!targetUserId) {
          setIsLoading(false);
          return;
        }
        
        // Check if this is the current user's profile
        setIsCurrentUser(currentUserId === targetUserId);
        
        // Get basic profile info
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', targetUserId)
          .single();
        
        if (profileError) throw profileError;
        
        // Check if current user is following this profile
        if (currentUserId && targetUserId !== currentUserId) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', currentUserId)
            .eq('following_id', targetUserId)
            .maybeSingle();
          
          setIsFollowing(!!followData);
        }
        
        // Get follower count
        const { count: followersCount, error: followersError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('following_id', targetUserId);
        
        if (followersError) console.error("Error fetching followers count:", followersError);
        
        // Get following count
        const { count: followingCount, error: followingError } = await supabase
          .from('follows')
          .select('*', { count: 'exact', head: true })
          .eq('follower_id', targetUserId);
        
        if (followingError) console.error("Error fetching following count:", followingError);
        
        // Get articles count
        const { count: articlesCount, error: articlesError } = await supabase
          .from('articles')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId);
        
        if (articlesError) console.error("Error fetching articles count:", articlesError);
        
        // Cast profileData to Profile type to ensure type safety
        const typedProfileData = profileData as Profile;
        
        // Mock some data that would normally come from database
        const userData: UserProfile = {
          id: typedProfileData.id,
          name: typedProfileData.full_name || 'Unnamed User',
          username: typedProfileData.username,
          avatar: typedProfileData.avatar_url,
          coverImage: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e",
          headline: typedProfileData.status || "User on the platform",
          bio: "This user hasn't added a bio yet.",
          location: "Unknown location",
          // phone: typedProfileData.phone || undefined,
          email: session?.user?.email || undefined,
          joined: typedProfileData.created_at,
          followers: followersCount || 0,
          following: followingCount || 0,
          articles: articlesCount || 0,
          skills: ["Networking", "Product Development", "User Experience"],
          experience: [],
          education: [],
          certifications: []
        };
        
        setProfile(userData);
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [userId]);
  
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!profile || !isCurrentUser) {
      toast({
        title: "Error",
        description: "You can only edit your own profile.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.name,
          username: profileData.username,
          avatar_url: profileData.avatar,
          status: profileData.headline,
          // phone: profileData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile({
        ...profile,
        ...profileData
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
      return false;
    }
  };
  
  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile || !isCurrentUser) {
      toast({
        title: "Error",
        description: "You can only upload avatar for your own profile.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${profile.id}-${uuidv4()}.${fileExt}`;
      
      // Upload the file to Supabase Storage - removing the onUploadProgress property
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the profile with the new avatar URL
      await updateProfile({ avatar: publicUrl });
      
      toast({
        title: "Avatar uploaded",
        description: "Your profile picture has been updated successfully.",
      });
      
      setUploadProgress(0);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture.",
        variant: "destructive"
      });
      setUploadProgress(0);
      return null;
    }
  };
  
  const toggleFollow = async () => {
    if (!profile || isCurrentUser) {
      toast({
        title: "Error",
        description: isCurrentUser ? "You cannot follow yourself." : "Failed to follow user.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      
      if (!currentUserId) {
        toast({
          title: "Error",
          description: "You need to be logged in to follow users.",
          variant: "destructive"
        });
        return;
      }
      
      if (isFollowing) {
        // Unfollow: Delete the record
        const { error: unfollowError } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', profile.id);
        
        if (unfollowError) throw unfollowError;
        
        setIsFollowing(false);
        setProfile({
          ...profile,
          followers: profile.followers - 1
        });
        
        toast({
          title: "Unfollowed",
          description: `You have unfollowed ${profile.name}.`,
        });
      } else {
        // Follow: Insert a new record
        const { error: followError } = await supabase
          .from('follows')
          .insert({
            follower_id: currentUserId,
            following_id: profile.id
          });
        
        if (followError) throw followError;
        
        setIsFollowing(true);
        setProfile({
          ...profile,
          followers: profile.followers + 1
        });
        
        toast({
          title: "Following",
          description: `You are now following ${profile.name}.`,
        });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: "Failed to process follow request.",
        variant: "destructive"
      });
    }
  };
  
  return {
    profile,
    isCurrentUser,
    isLoading,
    isFollowing,
    uploadProgress,
    updateProfile,
    uploadAvatar,
    toggleFollow
  };
};
