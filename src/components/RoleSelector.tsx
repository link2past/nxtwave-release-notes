import { Button } from "@/components/ui/button";
import { useUserRole } from "@/contexts/UserRoleContext";
import { useNavigate } from "react-router-dom";

export function RoleSelector() {
  const { role, setRole } = useUserRole();
  const navigate = useNavigate();

  const handleLogout = () => {
    setRole('user');
    navigate('/login');
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