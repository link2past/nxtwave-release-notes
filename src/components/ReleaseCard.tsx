import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  datetime: string;
  category: "feature" | "bugfix" | "enhancement";
  tags: Tag[];
  media?: {
    type: "image" | "video";
    url: string;
  }[];
}

const categoryColors = {
  feature: "bg-emerald-500 text-white",
  bugfix: "bg-red-500 text-white",
  enhancement: "bg-purple-500 text-white",
} as const;

const categoryLabels = {
  feature: "Feature",
  bugfix: "Bug Fix",
  enhancement: "Enhancement",
} as const;

interface ReleaseCardProps {
  release: ReleaseNote;
  onEdit?: () => void;
  onClick?: () => void;
}

export function ReleaseCard({ release, onEdit, onClick }: ReleaseCardProps) {
  const { role } = useUserRole();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit();
    }
  };

  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${categoryColors[release.category]}`}
          >
            {categoryLabels[release.category]}
          </span>
          <time className="text-sm text-muted-foreground">
            {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
          </time>
        </div>
        {role === "admin" && onEdit && (
          <button
            onClick={handleEditClick}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Edit
          </button>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-card-foreground">{release.title}</h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: release.description }}
      />
      {release.media && release.media.length > 0 && (
        <div className="mb-4 space-y-2">
          {release.media.map((item, index) => (
            item.type === 'image' ? (
              <img 
                key={index}
                src={item.url}
                alt=""
                className="rounded-md max-h-48 object-cover"
              />
            ) : (
              <video 
                key={index}
                src={item.url}
                controls
                className="rounded-md max-h-48 w-full"
              />
            )
          ))}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {release.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-3 py-1 text-xs rounded-full transition-colors duration-200 hover:opacity-80"
            style={{ 
              backgroundColor: `${tag.color}20`, 
              color: tag.color,
              boxShadow: `0 1px 2px ${tag.color}10`
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}