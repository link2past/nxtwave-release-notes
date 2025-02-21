
import { ReleaseCard } from "./ReleaseCard";
import type { ReleaseNote } from "@/types/release";
import { AdminDialog } from "./AdminDialog";
import { useUserRole } from "@/contexts/UserRoleContext";

interface ReleaseListProps {
  releases: ReleaseNote[];
  onSaveRelease: (release: Partial<ReleaseNote>) => void;
  onReleaseClick: (release: ReleaseNote) => void;
  onDeleteRelease: (id: string) => Promise<void>;
  showNewReleaseButton?: boolean;
}

export function ReleaseList({ 
  releases, 
  onSaveRelease, 
  onReleaseClick, 
  onDeleteRelease,
  showNewReleaseButton = true 
}: ReleaseListProps) {
  const { role } = useUserRole();

  return (
    <div className="space-y-6">
      {role === 'admin' && showNewReleaseButton && (
        <div className="flex justify-end mb-6">
          <AdminDialog onSave={onSaveRelease} />
        </div>
      )}
      
      {releases.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No releases found matching your criteria
        </div>
      ) : (
        <div className="grid gap-6">
          {releases.map((release) => (
            <div 
              key={release.id} 
              className="flex items-start gap-4 w-full"
            >
              <div className="flex-1">
                <ReleaseCard 
                  release={release}
                  onClick={() => onReleaseClick(release)}
                  onDelete={onDeleteRelease}
                />
              </div>
              {role === 'admin' && (
                <AdminDialog release={release} onSave={onSaveRelease} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
