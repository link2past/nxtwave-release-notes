import { ReleaseCard, ReleaseNote } from "./ReleaseCard";
import { AdminDialog } from "./AdminDialog";
import { useUserRole } from "@/contexts/UserRoleContext";

interface ReleaseListProps {
  releases: ReleaseNote[];
  onSaveRelease: (release: Partial<ReleaseNote>) => void;
  onReleaseClick: (release: ReleaseNote) => void;
}

export function ReleaseList({ releases, onSaveRelease, onReleaseClick }: ReleaseListProps) {
  const { role } = useUserRole();

  if (releases.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No releases found matching your criteria
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {releases.map((release) => (
        <div 
          key={release.id} 
          className="flex items-start gap-4 w-full"
          onClick={() => onReleaseClick(release)}
        >
          <div className="flex-1 cursor-pointer">
            <ReleaseCard 
              release={release}
              onClick={() => onReleaseClick(release)}
            />
          </div>
          {role === 'admin' && (
            <AdminDialog release={release} onSave={onSaveRelease} />
          )}
        </div>
      ))}
    </div>
  );
}