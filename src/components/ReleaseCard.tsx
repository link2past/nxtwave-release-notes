
import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { MediaDisplay } from "./MediaDisplay";
import { TagList } from "./TagList";
import type { ReleaseNote } from "@/types/release";
import { CategoryBadge } from "./CategoryBadge";
import { DeleteReleaseButton } from "./DeleteReleaseButton";
import { ShareButton } from "./ShareButton";

interface ReleaseCardProps {
  release: ReleaseNote;
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function ReleaseCard({ release, onClick, onDelete }: ReleaseCardProps) {
  const { role } = useUserRole();

  console.log("ReleaseCard rendered for release:", release.id);
  console.log("onDelete prop exists:", !!onDelete);

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.delete-button, .copy-link-button')) {
      console.log("Click intercepted by delete or copy button");
      return;
    }
    console.log("Card clicked");
    onClick?.();
  };

  const handleDelete = () => {
    console.log("Handle delete called in ReleaseCard for id:", release.id);
    onDelete?.(release.id);
  };

  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CategoryBadge category={release.category} />
          <time className="text-sm text-muted-foreground font-playfair italic">
            {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
          </time>
        </div>
        {role === 'admin' && (
          <div className="absolute top-2 right-2">
            <DeleteReleaseButton onDelete={handleDelete} />
          </div>
        )}
      </div>

      <h3 className="text-xl font-playfair font-semibold mb-3 text-highlight-purple group-hover:text-highlight-purple/90 transition-colors">
        {release.title}
      </h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert font-playfair"
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
            <h4 className="text-sm font-medium mb-2 font-playfair">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {release.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-3 py-1 text-xs rounded-full transition-colors duration-200 font-playfair"
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
            <h4 className="text-sm font-medium mb-2 font-playfair">Tags</h4>
            <TagList tags={release.tags} />
          </div>
        )}
      </div>
    </div>
  );
}
