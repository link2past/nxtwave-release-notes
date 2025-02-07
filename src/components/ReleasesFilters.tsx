
import { DateRange } from "react-day-picker";
import { FiltersSection } from "./FiltersSection";

interface ReleasesFiltersProps {
  search: string;
  category: string;
  sortOrder: "asc" | "desc";
  dateRange: DateRange | undefined;
  selectedDateFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onDateRangeChange: (value: DateRange | undefined) => void;
  onDateFilterChange: (value: string) => void;
  onClear: () => void;
}

export function ReleasesFilters({
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
  onClear
}: ReleasesFiltersProps) {
  return (
    <FiltersSection
      search={search}
      category={category}
      sortOrder={sortOrder}
      dateRange={dateRange}
      selectedDateFilter={selectedDateFilter}
      onSearchChange={onSearchChange}
      onCategoryChange={onCategoryChange}
      onSortChange={onSortChange}
      onDateRangeChange={onDateRangeChange}
      onDateFilterChange={onDateFilterChange}
      onClear={onClear}
    />
  );
}
