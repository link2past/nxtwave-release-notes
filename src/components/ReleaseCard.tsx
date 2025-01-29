import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { MediaDisplay } from "./MediaDisplay";
import { TagList } from "./TagList";

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
  onClick?: () => void;
}

export function ReleaseCard({ release, onClick }: ReleaseCardProps) {
  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer"
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
      </div>
      <h3 className="text-xl font-semibold mb-3 text-card-foreground">{release.title}</h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: release.description }}
      />
      {release.media && release.media.length > 0 && (
        <MediaDisplay media={release.media} />
      )}
      <TagList tags={release.tags} />
    </div>
  );
}