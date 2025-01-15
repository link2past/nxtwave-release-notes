import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  category: string;
  sortOrder: "asc" | "desc";
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onClear: () => void;
}

export function FilterBar({
  category,
  sortOrder,
  onCategoryChange,
  onSortChange,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          <SelectItem value="feature">Feature</SelectItem>
          <SelectItem value="bugfix">Bug Fix</SelectItem>
          <SelectItem value="enhancement">Enhancement</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortOrder} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="desc">Newest first</SelectItem>
          <SelectItem value="asc">Oldest first</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}