import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  category: string;
  sortOrder: "asc" | "desc";
  dateRange: {
    start: string;
    end: string;
  };
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onClear: () => void;
}

export function FilterBar({
  category,
  sortOrder,
  dateRange,
  onCategoryChange,
  onSortChange,
  onDateRangeChange,
  onClear,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
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

      <div className="flex items-center gap-2">
        <Input
          type="date"
          value={dateRange.start}
          onChange={(e) => onDateRangeChange({ ...dateRange, start: e.target.value })}
          className="w-[180px]"
        />
        <span className="text-muted-foreground">to</span>
        <Input
          type="date"
          value={dateRange.end}
          onChange={(e) => onDateRangeChange({ ...dateRange, end: e.target.value })}
          className="w-[180px]"
        />
      </div>

      <Button variant="outline" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}