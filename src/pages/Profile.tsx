
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileAbout } from "@/components/profile/ProfileAbout";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { supabase } from "@/integrations/supabase/client";
import { fetchProfileById } from "@/lib/supabase-queries";
import { toast } from "@/hooks/use-toast";
import { ExtendedProfile } from "@/types/profile";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<ExtendedProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        // Get current session to determine if this is the user's own profile
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.id === id) {
          setIsOwnProfile(true);
        }

        // Fetch profile data
        const profileData = await fetchProfileById(id || "");
        
        if (profileData) {
          // Initialize extended profile data with default values for missing fields
          const extendedProfile: ExtendedProfile = {
            ...profileData,
            bio: "This user hasn't added a bio yet.",
            location: "Unknown location",
            website: undefined,
            email: session?.user?.email,
            joined: profileData.created_at || new Date().toISOString(), // Use created_at as joined date or fallback to current date
            followers: 0,
            following: 0,
            articles: 0,
            skills: ["Networking", "Product Development", "User Experience"],
            experience: [],
            education: [],
            certifications: [],
            coverImage: "https://images.unsplash.com/photo-1579389083078-4e7018379f7e" // Default coverImage
          };
          
          setUser(extendedProfile);
        } else {
          toast({
            title: "Profile not found",
            description: "The requested profile could not be found.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "There was an error loading the profile.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Fetch user's articles
  useEffect(() => {
    const fetchArticles = async () => {
      if (!id) return;
      
      setIsLoadingArticles(true);
      try {
        const { data, error } = await supabase
          .from("articles")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false });
        
        if (error) throw error;
        setArticles(data || []);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast({
          title: "Error",
          description: "Failed to load articles.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingArticles(false);
      }
    };

    if (activeTab === "articles") {
      fetchArticles();
    }
  }, [id, activeTab]);

  if (isLoadingProfile) {
    return (
      <div className="container py-8">
        <div className="mb-8 h-64 w-full rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse" />
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-slate-200 animate-pulse" />
          <div>
            <div className="h-6 w-48 bg-slate-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>User not found</CardTitle>
            <CardDescription>The user profile you are looking for does not exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/">
              <Button>Return to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} />

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProfileAbout user={user} />
        </div>

        <div className="lg:col-span-3">
          <ProfileTabs 
            user={user} 
            isOwnProfile={isOwnProfile} 
            articles={articles}
            isLoadingArticles={isLoadingArticles}
          />
        </div>
      </div>
    </div>
  );
}
