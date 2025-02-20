
import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { MediaDisplay } from "./MediaDisplay";
import { TagList } from "./TagList";
import { type ReleaseNote } from "@/types/release";
import { CategoryBadge } from "./CategoryBadge";
import { DeleteReleaseButton } from "./DeleteReleaseButton";
import { ShareButton } from "./ShareButton";

interface ReleaseCardProps {
  release: ReleaseNote;
  onClick?: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function ReleaseCard({ release, onClick, onDelete }: ReleaseCardProps) {
  const { role } = useUserRole();

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-button, .copy-link-button')) {
      return;
    }
    onClick?.();
  };

  const handleDelete = async () => {
    try {
      console.log('ReleaseCard: Deleting release:', release.id);
      await onDelete(release.id);
      console.log('ReleaseCard: Delete successful');
    } catch (error) {
      console.error('ReleaseCard: Delete failed:', error);
      throw error; // Re-throw to be handled by the DeleteReleaseButton component
    }
  };

  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer relative group"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CategoryBadge category={release.category} />
          <time className="text-sm text-muted-foreground font-sans italic">
            {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
          </time>
        </div>
        {role === 'admin' && (
          <div className="flex items-center gap-2">
            <DeleteReleaseButton onDelete={handleDelete} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-sans font-semibold mb-3 text-highlight-purple group-hover:text-highlight-purple/90 transition-colors">
        {release.title}
      </h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert font-sans"
        dangerouslySetInnerHTML={{ __html: release.description }}
      />

      <div className="flex items-center gap-2 mb-4">
        <ShareButton slug={release.slug} />
      </div>

      {release.media && release.media.length > 0 && (
        <MediaDisplay media={release.media} />
      )}

      <div className="space-y-3">
        {release.labels && release.labels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 font-sans">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {release.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-3 py-1 text-xs rounded-full transition-colors duration-200 font-sans"
                  style={{ 
                    backgroundColor: `${label.color}20`, 
                    color: label.color,
                    boxShadow: `0 1px 2px ${label.color}10`
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {release.tags && release.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 font-sans">Tags</h4>
            <TagList tags={release.tags} />
          </div>
        )}
      </div>
    </div>
  );
}
