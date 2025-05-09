
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface RequireProfileProps {
  children: ReactNode;
}

export function RequireProfile({ children }: RequireProfileProps) {
  const { profile, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && profile) {
      // Check if profile has required fields
      const isProfileComplete = profile.full_name && profile.username;
      if (!isProfileComplete) {
        console.log("Profile is incomplete, redirecting to profile setup");
      }
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If profile is incomplete, redirect to profile setup
  if (!profile?.full_name || !profile?.username) {
    return <Navigate to="/profile-setup" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
