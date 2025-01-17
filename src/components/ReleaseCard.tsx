import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
}

export function ReleaseCard({ release, onEdit }: ReleaseCardProps) {
  const { role } = useUserRole();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer">
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
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Edit
              </button>
            )}
          </div>
          <h3 className="text-xl font-semibold mb-3 text-card-foreground">{release.title}</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-2">{release.description}</p>
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
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{release.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">{release.description}</p>
          <div className="flex flex-wrap gap-2">
            {release.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 text-xs rounded-full transition-colors duration-200"
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
      </DialogContent>
    </Dialog>
  );
}