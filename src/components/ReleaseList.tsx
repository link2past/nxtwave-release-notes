
import { ReleaseCard, ReleaseNote } from "./ReleaseCard";
import { AdminDialog } from "./AdminDialog";
import { useUserRole } from "@/contexts/UserRoleContext";

interface ReleaseListProps {
  releases: ReleaseNote[];
  onSaveRelease: (release: Partial<ReleaseNote>) => void;
  onReleaseClick: (release: ReleaseNote) => void;
  onDeleteRelease: (id: string) => void;
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await onDeleteRelease(id);
    } catch (error) {
      console.error('Error in ReleaseList delete handler:', error);
    }
  };

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
              onClick={(e) => {
                e.preventDefault();
                onReleaseClick(release);
              }}
            >
              <div className="flex-1">
                <ReleaseCard 
                  release={release}
                  onClick={(e) => {
                    e.preventDefault();
                    onReleaseClick(release);
                  }}
                  onDelete={(e) => handleDelete(e, release.id)}
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
