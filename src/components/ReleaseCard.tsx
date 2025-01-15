import { format } from "date-fns";

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
  feature: "bg-category-feature",
  bugfix: "bg-category-bugfix",
  enhancement: "bg-category-enhancement",
} as const;

const categoryLabels = {
  feature: "Feature",
  bugfix: "Bug Fix",
  enhancement: "Enhancement",
} as const;

export function ReleaseCard({ release }: { release: ReleaseNote }) {
  return (
    <div className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow border">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 text-xs font-medium text-white rounded ${categoryColors[release.category]}`}>
            {categoryLabels[release.category]}
          </span>
          <time className="text-sm text-muted-foreground">
            {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
          </time>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{release.title}</h3>
      <p className="text-muted-foreground mb-4">{release.description}</p>
      <div className="flex flex-wrap gap-2">
        {release.tags.map((tag) => (
          <span
            key={tag.id}
            className="px-2 py-1 text-xs rounded-full"
            style={{ backgroundColor: tag.color + "20", color: tag.color }}
          >
            {tag.name}
          </span>
        ))}
      </div>
    </div>
  );
}