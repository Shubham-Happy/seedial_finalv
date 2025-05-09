
import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export function MainLayout() {
  const isMobile = useIsMobile();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={cn("flex min-h-screen", isDarkMode ? "dark" : "")}>
      <Sidebar />
      <div className="flex flex-col flex-1 w-full">
        <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <main className="flex-1 p-4 md:p-6 pt-16 md:pt-6">
          <Outlet />
        </main>
        <footer className="py-4 md:py-6 px-4 md:px-6 border-t">
          <div className="container flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Statusnow. All rights reserved.</p>
            <nav className="flex gap-2 md:gap-4 flex-wrap justify-center">
              <Link to="/about" className="hover:underline">About</Link>
              <Link to="/privacy" className="hover:underline">Privacy</Link>
              <Link to="/terms" className="hover:underline">Terms</Link>
              <Link to="/faq" className="hover:underline">FAQ</Link>
            </nav>
          </div>
        </footer>
      </div>
    </div>
  );
}
