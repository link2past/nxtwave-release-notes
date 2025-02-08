
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { DateRange } from "react-day-picker";

interface FiltersSectionProps {
  search: string;
  category: string;
  sortOrder: "asc" | "desc";
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
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
