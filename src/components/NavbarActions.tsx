
import { Button } from "./ui/button";
import { Download, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useReleases } from "@/hooks/useReleases";
import { downloadReleasesAsCSV } from "@/utils/csvExport";

export function NavbarActions() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();
  const { releases } = useReleases();

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

  return (
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
          onClick={() => downloadReleasesAsCSV(releases)}
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
  );
}
