
import { categoryColors, categoryLabels } from "@/types/release";
import type { ReleaseNote } from "@/types/release";

interface CategoryBadgeProps {
  category: ReleaseNote["category"];
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span 
      className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${categoryColors[category]}`}
    >
      {categoryLabels[category]}
    </span>
  );
}
