import { Button } from "@/components/ui/button";
import { useUserRole } from "@/contexts/UserRoleContext";

export function RoleSelector() {
  const { role, setRole } = useUserRole();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={role === 'user' ? 'default' : 'outline'}
        onClick={() => setRole('user')}
        size="sm"
      >
        User Mode
      </Button>
      <Button
        variant={role === 'admin' ? 'default' : 'outline'}
        onClick={() => setRole('admin')}
        size="sm"
      >
        Admin Mode
      </Button>
    </div>
  );
}