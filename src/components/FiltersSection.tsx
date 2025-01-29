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
  selectedDateFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onDateFilterChange: (value: string) => void;
  onClear: () => void;
}

export function FiltersSection({
  search,
  category,
  sortOrder,
  dateRange,
  selectedDateFilter,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onDateRangeChange,
  onDateFilterChange,
  onClear,
}: FiltersSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterBar
        category={category}
        sortOrder={sortOrder}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onDateRangeChange={onDateRangeChange}
        onDateFilterChange={onDateFilterChange}
        onClear={onClear}
      />
    </div>
  );
}