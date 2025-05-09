
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, FileText, Users, Search, Bell, Menu, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavIconProps {
  Icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}

const MobileNavIcon = ({ Icon, label, active, onClick }: MobileNavIconProps) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center h-full w-full"
  >
    <Icon 
      size={20} 
      className={cn(
        "mb-1 transition-colors", 
        active ? "text-statusnow-purple" : "text-muted-foreground"
      )} 
    />
    <span className={cn(
      "text-xs font-medium transition-colors",
      active ? "text-statusnow-purple" : "text-muted-foreground"
    )}>
      {label}
    </span>
  </button>
);

export const MobileNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Define nav items based on whether user is logged in or not
  const isPublicPage = ["/", "/blog", "/help-center", "/community", "/startup-guide", "/about-us", "/careers", "/privacy-policy", "/terms-of-service"].includes(path);

  const authNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Articles", path: "/articles" },
    { icon: Users, label: "Network", path: "/network" },
    { icon: Trophy, label: "Startups", path: "/startups" },
    { icon: Search, label: "Search", path: "/search" }
  ];

  const publicNavItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: FileText, label: "Blog", path: "/blog" },
    { icon: Users, label: "Community", path: "/community" },
    { icon: Trophy, label: "Startups", path: "/startups" },
    { icon: Bell, label: "About", path: "/about-us" }
  ];

  const navItems = isPublicPage ? publicNavItems : authNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-background dark:bg-sidebar border-t border-border shadow-md z-30 grid grid-cols-5 lg:hidden">
      {navItems.map((item) => (
        <MobileNavIcon 
          key={item.path}
          Icon={item.icon}
          label={item.label}
          active={path === item.path || (path === "/home" && item.path === "/")}
          onClick={() => navigate(item.path)}
        />
      ))}
    </div>
  );
};
