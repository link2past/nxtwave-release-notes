import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";

interface FiltersSectionProps {
  search: string;
  category: string;
  sortOrder: "asc" | "desc";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: "asc" | "desc") => void;
  onClear: () => void;
}

export function FiltersSection({
  search,
  category,
  sortOrder,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}: FiltersSectionProps) {
  return (
    <div className="space-y-6 mb-8">
      <SearchBar value={search} onChange={onSearchChange} />
      <FilterBar
        category={category}
        sortOrder={sortOrder}
        onCategoryChange={onCategoryChange}
        onSortChange={onSortChange}
        onClear={onClear}
      />
    </div>
  );
}