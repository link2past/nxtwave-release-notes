import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { AdminDialog } from "./AdminDialog";
import { RoleSelector } from "./RoleSelector";
import { useUserRole } from "@/contexts/UserRoleContext";
import { ReleaseNote } from "@/types/release";

interface HeaderProps {
  onSaveRelease: (release: Partial<ReleaseNote>) => void;
}

export function Header({ onSaveRelease }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Release Notes
      </h1>
      <div className="flex items-center gap-4">
        <RoleSelector />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        {role === 'admin' && <AdminDialog onSave={onSaveRelease} />}
      </div>
    </div>
  );
}
