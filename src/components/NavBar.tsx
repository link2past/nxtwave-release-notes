
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Download, LogOut, Moon, Sun } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useTheme } from "next-themes";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useReleases } from "@/hooks/useReleases";

export function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();
  const { releases } = useReleases();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/login');
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const headers = ["Title", "Description", "Category", "Date"];
      const csvContent = [
        headers.join(","),
        ...releases.map(release => [
          `"${release.title.replace(/"/g, '""')}"`,
          `"${release.description.replace(/"/g, '""')}"`,
          release.category,
          new Date(release.datetime).toLocaleDateString()
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", `release_notes_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Download complete",
        description: "Release notes have been downloaded as CSV.",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Download failed",
        description: "Failed to download release notes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-24 h-12">
              <img
                src="/lovable-uploads/ca037825-5ebf-43f5-8df4-f9ad635772ed.png"
                alt="NXT WAVE Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-semibold">Release Notes</h1>
          </div>

          {!isAuthPage && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                {role === 'admin' ? 'Admin Mode' : 'User Mode'}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
              {role === 'admin' && (
                <Button
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
