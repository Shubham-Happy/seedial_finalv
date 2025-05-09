
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const { user, isLoading } = useAuth(); // Changed from loading to isLoading
  const navigate = useNavigate();

  // Call seed data function when user logs in
  useEffect(() => {
    const seedData = async () => {
      if (user) {
        try {
          await supabase.functions.invoke('seedData');
        } catch (error) {
          console.error("Error seeding data:", error);
        }
      }
    };
    
    seedData();
  }, [user]);

  useEffect(() => {
    if (!isLoading && requireAuth && !user) { // Changed from loading to isLoading
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate, requireAuth]); // Changed from loading to isLoading

  if (isLoading) { // Changed from loading to isLoading
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
