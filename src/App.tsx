import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ResourceLayout } from "@/components/layout/ResourceLayout";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ABTestingProvider } from "@/context/ABTestingContext";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { RequireProfile } from "@/components/layout/RequireProfile";
import { BetaBanner } from "@/components/ui/BetaBanner";
import React from "react";

// Import pages
import Home from "@/pages/Home";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import CreateArticle from "@/pages/CreateArticle";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Fundraising from "@/pages/Fundraising";
import FundraisingDetail from "@/pages/FundraisingDetail";
import StartupShowcase from "@/pages/StartupShowcase";
import StartupDetail from "@/pages/StartupDetail";
import Jobs from "@/pages/Jobs";
import PostJob from "@/pages/PostJob";
import JobDetail from "@/pages/JobDetail";
import JobApplications from "@/pages/JobApplications";
import Notifications from "@/pages/Notifications";
import Network from "@/pages/Network";
import Search from "@/pages/Search";
import Messages from "@/pages/Messages";
import Feedback from "@/pages/Feedback";
import Settings from "@/pages/Settings";
import Logout from "@/pages/Logout";
import Posts from "@/pages/Posts";
import ProfileSetup from "@/pages/ProfileSetup";
import Index from "@/pages/Index";
import Blog from "@/pages/Blog";
import HelpCenter from "@/pages/HelpCenter";
import Community from "@/pages/Community";
import StartupGuide from "@/pages/StartupGuide";
import AboutUs from "@/pages/AboutUs";
import Careers from "@/pages/Careers";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import KingismPanel from "@/pages/KingismPanel";

// Create a component for secure Admin Route
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <RequireAuth>
      <RequireProfile>
        {children}
      </RequireProfile>
    </RequireAuth>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ABTestingProvider>
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<Index />} />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />

                {/* Public Pages with Resource Layout */}
                <Route element={<ResourceLayout />}>
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<Blog />} />
                  <Route path="/help-center" element={<HelpCenter />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/startup-guide" element={<StartupGuide />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                </Route>

                {/* Admin Routes - Secure routes for admin panel */}
                <Route path="/kingism" element={
                  <AdminRoute>
                    <KingismPanel />
                  </AdminRoute>
                } />

                <Route path="/admin" element={
                  <Navigate to="/kingism" replace />
                } />

                {/* App Routes with MainLayout */}
                <Route
                  path="/"
                  element={
                    <RequireAuth>
                      <RequireProfile>
                        <MainLayout />
                      </RequireProfile>
                    </RequireAuth>
                  }
                >
                  <Route path="home" element={<Home />} />
                  <Route path="articles" element={<Articles />} />
                  <Route path="articles/new" element={<CreateArticle />} />
                  <Route path="articles/:id" element={<ArticleDetail />} />
                  <Route path="profile" element={<Navigate to="/profile/1" replace />} />
                  <Route path="profile/:id" element={<Profile />} />
                  <Route path="network" element={<Network />} />
                  <Route path="jobs" element={<Jobs />} />
                  <Route path="jobs/post" element={<PostJob />} />
                  <Route path="jobs/:id" element={<JobDetail />} />
                  <Route path="jobs/applications" element={<JobApplications />} />
                  <Route path="search" element={<Search />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="posts" element={<Posts />} />
                  <Route path="feedback" element={<Feedback />} />
                  <Route path="settings" element={<Settings />} />

                  {/* Routes */}
                  <Route path="fundraising" element={<Fundraising />} />
                  <Route path="fundraising/:id" element={<FundraisingDetail />} />
                  <Route path="startups" element={<StartupShowcase />} />
                  <Route path="startups/:id" element={<StartupDetail />} />
                </Route>

                {/* Other standalone pages */}
                <Route
                  path="/about"
                  element={
                    <div className="container p-8">
                      <h1 className="text-3xl font-bold mb-6">About Seedial</h1>
                      <p className="mb-4">
                        Seedial is a professional network for entrepreneurs and startup founders.
                      </p>
                      <p>
                        Our mission is to connect founders with resources, mentors, and investors to help them grow their
                        businesses.
                      </p>
                      <BetaBanner />
                    </div>
                  }
                />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              <BetaBanner />
            </ABTestingProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </React.StrictMode>
  </QueryClientProvider>
);

export default App;
