import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";

interface FiltersSectionProps {
  search: string;
  category: string;
  sortOrder: "asc" | "desc";
  dateRange: {
    start: string;
    end: string;
  };
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onClear: () => void;
}

export function FiltersSection({
  search,
  category,
  sortOrder,
  dateRange,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onDateRangeChange,
  onClear,
}: FiltersSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterBar
        category={category}
        sortOrder={sortOrder}
        dateRange={dateRange}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onDateRangeChange={onDateRangeChange}
        onClear={onClear}
      />
    </div>
  );
}