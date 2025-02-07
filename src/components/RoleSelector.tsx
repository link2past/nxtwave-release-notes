
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";

export function RoleSelector() {
  const { role, setRole } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setRole('user');
      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {role === 'admin' ? 'Admin Mode' : 'User Mode'}
      </span>
      <Button
        variant="outline"
        onClick={handleLogout}
        size="sm"
      >
        Logout
      </Button>
    </div>
  );
}
