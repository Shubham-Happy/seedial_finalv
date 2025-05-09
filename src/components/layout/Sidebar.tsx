import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  FileText,
  Users,
  Briefcase,
  Search,
  Bell,
  Mail,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  Award,
  Trophy,
  X,
  Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNavbar } from "./MobileNavbar";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: FileText, label: "Articles", path: "/articles" },
  { icon: Users, label: "Network", path: "/network" },
  { icon: Trophy, label: "Startups", path: "/startups" },
  { icon: Award, label: "Fundraising", path: "/fundraising" },
  { icon: Briefcase, label: "Jobs", path: "/jobs" },
  { icon: Search, label: "Search", path: "/search" },
];

const userNavItems = [
  { icon: Mail, label: "Messages", path: "/messages" },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { profile, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  // Reset mobile menu when resizing from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed || isMobile ? (
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light   bg-clip-text">
              Seedial
            </span>
          </Link>
        ) : (
          <div className="w-6 h-6 bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light rounded-md mx-auto" />
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
        {isMobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={18} />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto py-4 space-y-2">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "flex items-center justify-start w-full gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group transition-colors",
                location.pathname === item.path && "bg-sidebar-accent"
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon size={20} className="text-sidebar-foreground opacity-75" />
              {(!collapsed || isMobile) && (
                <span className="text-sidebar-foreground group-hover:text-sidebar-foreground">
                  {item.label}
                </span>
              )}
            </Button>
          ))}
        </div>

        <div className="px-3 pt-4 mt-4 border-t border-sidebar-border">
          <h3 className={cn("px-3 mb-2 text-xs uppercase text-sidebar-foreground/50", collapsed && !isMobile && "sr-only")}>
            User
          </h3>
          <div className="space-y-1">
            {userNavItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                className={cn(
                  "flex items-center justify-start w-full gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group transition-colors",
                  location.pathname === item.path && "bg-sidebar-accent"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon size={20} className="text-sidebar-foreground opacity-75" />
                {(!collapsed || isMobile) && (
                  <span className="text-sidebar-foreground group-hover:text-sidebar-foreground">
                    {item.label}
                  </span>
                )}
              </Button>
            ))}

            {/* Kingism panel access button for admins only */}
            {isAdmin && (
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center justify-start w-full gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group transition-colors",
                  location.pathname === "/kingism" && "bg-sidebar-accent"
                )}
                onClick={() => handleNavigation("/kingism")}
              >
                <Database size={20} className="text-sidebar-foreground opacity-75" />
                {(!collapsed || isMobile) && (
                  <span className="text-sidebar-foreground group-hover:text-sidebar-foreground">
                    Admin Panel
                  </span>
                )}
              </Button>
            )}
            
            <Button
              onClick={handleLogout}
              className="flex items-center justify-start gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent group transition-colors w-full text-destructive"
              variant="ghost"
            >
              <LogOut size={20} className="opacity-75" />
              {(!collapsed || isMobile) && <span>Logout</span>}
            </Button>
          </div>
        </div>
      </div>

      <div className={cn("p-4 border-t border-sidebar-border flex items-center gap-3",
        collapsed && !isMobile ? "justify-center" : "")}>
        {!collapsed || isMobile ? (
          <>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light flex items-center justify-center">
              <span className="text-white font-semibold">
                {getInitials(profile?.full_name || profile?.username || "User")}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">
                {profile?.full_name || profile?.username || "User"}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {profile?.status || "Member"}
              </p>
            </div>
          </>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light flex items-center justify-center">
            <span className="text-white font-semibold">
              {getInitials(profile?.full_name || profile?.username || "User")}
            </span>
          </div>
        )}
      </div>
    </>
  );

  // For mobile, render a Sheet (slide-out drawer) and also add the mobile navbar at the bottom
  if (isMobile) {
    return (
      <>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-3 left-3 z-50 lg:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-r border-sidebar-border bg-sidebar">
            {sidebarContent}
          </SheetContent>
        </Sheet>
        
        {/* Mobile bottom navigation */}
        <MobileNavbar />
        
        {/* Add padding to the bottom content to prevent overlap with mobile navbar */}
        <div className="pb-16 lg:pb-0"></div>
      </>
    );
  }

  // For desktop, render the regular sidebar
  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-sidebar sticky top-0 transition-all duration-300 hidden lg:flex",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      {sidebarContent}
    </div>
  );
}
