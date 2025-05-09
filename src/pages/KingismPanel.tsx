
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Loader2, Lock, BarChart, Users, FileText, Database } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserManagement } from "@/components/admin/UserManagement";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Dashboard } from "@/components/admin/Dashboard";
import { ContentManagement } from "@/components/admin/ContentManagement";
import { SystemSettings } from "@/components/admin/SystemSettings";
import { Button } from "@/components/ui/button";

export default function KingismPanel() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [counts, setCounts] = useState({
    users: 0,
    posts: 0,
    articles: 0,
    jobs: 0,
    startups: 0,
    events: 0
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please login to access the admin panel.",
            variant: "destructive",
          });
          navigate('/login', { state: { adminAccess: true } });
          return;
        }
        
        // Check if user has admin privileges
        if (isAdmin) {
          // User has admin flag in context
          setHasAccess(true);
          fetchCounts();
        } else {
          // Double-check admin status from database
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
            
          if (data?.is_admin) {
            setHasAccess(true);
            fetchCounts();
          } else {
            // Special access for specific emails - debug only
            if (session.user.email === "kingism@seedial.com" || 
                session.user.email === "kingism" || 
                session.user.email === "shubhshri45sv@gmail.com" || 
                session.user.email === "admin@statusnow.com") {
              setHasAccess(true);
              fetchCounts();
            } else {
              toast({
                title: "Access Denied",
                description: "You don't have admin permissions.",
                variant: "destructive",
              });
              navigate('/home');
            }
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Error",
          description: "Could not verify admin access.",
          variant: "destructive",
        });
        navigate('/home');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [navigate, isAdmin]);
  
  const fetchCounts = async () => {
    try {
      setIsLoading(true);
      
      // Use Promise.allSettled to continue even if some queries fail
      const results = await Promise.allSettled([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('articles').select('*', { count: 'exact', head: true }),
        supabase.from('job_listings').select('*', { count: 'exact', head: true }),
        supabase.from('startups').select('*', { count: 'exact', head: true }),
        supabase.from('funding_events').select('*', { count: 'exact', head: true })
      ]);
      
      // Process results safely
      const countsData = {
        users: 0,
        posts: 0,
        articles: 0,
        jobs: 0,
        startups: 0,
        events: 0
      };
      
      if (results[0].status === 'fulfilled') {
        countsData.users = results[0].value.count || 0;
      }
      
      if (results[1].status === 'fulfilled') {
        countsData.posts = results[1].value.count || 0;
      }
      
      if (results[2].status === 'fulfilled') {
        countsData.articles = results[2].value.count || 0;
      }
      
      if (results[3].status === 'fulfilled') {
        countsData.jobs = results[3].value.count || 0;
      }
      
      if (results[4].status === 'fulfilled') {
        countsData.startups = results[4].value.count || 0;
      }
      
      if (results[5].status === 'fulfilled') {
        countsData.events = results[5].value.count || 0;
      }
      
      setCounts(countsData);
    } catch (error) {
      console.error("Error fetching counts:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-12 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 animate-spin text-purple-600" />
          <p className="mt-4 text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return (
      <div className="container max-w-6xl mx-auto py-12">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Lock className="h-16 w-16 text-purple-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-4">You don't have access to the admin panel.</p>
          <Button onClick={() => navigate('/home')} className="bg-purple-600 hover:bg-purple-700">Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-6">
      <div className="flex flex-col gap-6">
        <AdminHeader />
        
        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-cream-50 dark:bg-purple-900/20 p-1 mb-6">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <BarChart className="h-4 w-4 mr-2" />Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Users className="h-4 w-4 mr-2" />Users
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-2" />Content
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <Database className="h-4 w-4 mr-2" />System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="focus:outline-none">
            <Dashboard counts={counts} />
          </TabsContent>
          
          <TabsContent value="users" className="focus:outline-none">
            <UserManagement />
          </TabsContent>

          <TabsContent value="content" className="focus:outline-none">
            <ContentManagement />
          </TabsContent>

          <TabsContent value="system" className="focus:outline-none">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
