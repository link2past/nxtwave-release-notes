import { useState } from "react";
import { ReleaseCard } from "@/components/ReleaseCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";

// Sample data - in a real app this would come from an API
const releases = [
  {
    id: "1",
    title: "New Dashboard Features",
    description: "Added new analytics widgets and improved performance",
    datetime: "2024-03-20T10:00:00Z",
    category: "feature",
    tags: [
      { id: "1", name: "dashboard", color: "#2563eb" },
      { id: "2", name: "analytics", color: "#10b981" },
    ],
  },
  {
    id: "2",
    title: "Bug Fix: User Authentication",
    description: "Fixed issues with social login providers",
    datetime: "2024-03-19T15:30:00Z",
    category: "bugfix",
    tags: [
      { id: "3", name: "auth", color: "#ef4444" },
      { id: "4", name: "security", color: "#8b5cf6" },
    ],
  },
  {
    id: "3",
    title: "UI Improvements",
    description: "Enhanced user interface with new animations",
    datetime: "2024-03-18T09:15:00Z",
    category: "enhancement",
    tags: [
      { id: "5", name: "ui", color: "#f59e0b" },
      { id: "6", name: "animations", color: "#06b6d4" },
    ],
  },
] as const;

export default function Index() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        search === "" ||
        release.title.toLowerCase().includes(search.toLowerCase()) ||
        release.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "" || release.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSortOrder("desc");
  };

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Release Notes</h1>
      
      <div className="space-y-6 mb-8">
        <SearchBar value={search} onChange={setSearch} />
        
        <FilterBar
          category={category}
          sortOrder={sortOrder}
          onCategoryChange={setCategory}
          onSortChange={setSortOrder}
          onClear={clearFilters}
        />
      </div>

      <div className="grid gap-6">
        {filteredReleases.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))}
      </div>

      {filteredReleases.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No releases found matching your criteria
        </div>
      )}
    </div>
  );
}