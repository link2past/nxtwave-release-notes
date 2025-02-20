
import { useEffect, useState } from "react";
import { ReleaseList } from "@/components/ReleaseList";
import { ReleasesFilters } from "@/components/ReleasesFilters";
import { useReleases } from "@/hooks/useReleases";
import { DateRange } from "react-day-picker";
import { ReleaseNote } from "@/components/ReleaseCard";
import { useToast } from "@/components/ui/use-toast";

export default function Dashboard() {
  const { releases, fetchReleases, handleSaveRelease } = useReleases();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    console.log("Fetching releases...");
    fetchReleases();
  }, []);

  const handleReleaseClick = (release: ReleaseNote) => {
    console.log('Release clicked:', release);
    // Implement detailed view if needed
  };

  const handleDeleteRelease = async (id: string) => {
    // Implement delete functionality if needed
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setSortOrder("desc");
    setDateRange(undefined);
    setSelectedDateFilter("all");
  };

  console.log("Current releases:", releases);
  console.log("Current filters:", { search, category, sortOrder, dateRange, selectedDateFilter });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Release Notes Dashboard</h1>
      </div>

      <ReleasesFilters
        search={search}
        category={category}
        sortOrder={sortOrder}
        dateRange={dateRange}
        selectedDateFilter={selectedDateFilter}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onSortChange={setSortOrder}
        onDateRangeChange={setDateRange}
        onDateFilterChange={setSelectedDateFilter}
        onClear={clearFilters}
      />

      <ReleaseList
        releases={releases
          .filter(release => {
            if (search) {
              const searchLower = search.toLowerCase();
              return (
                release.title.toLowerCase().includes(searchLower) ||
                release.description.toLowerCase().includes(searchLower)
              );
            }
            return true;
          })
          .filter(release => {
            if (category !== "all") {
              return release.category === category;
            }
            return true;
          })
          .filter(release => {
            if (dateRange?.from) {
              const releaseDate = new Date(release.datetime);
              if (dateRange.to) {
                return releaseDate >= dateRange.from && releaseDate <= dateRange.to;
              }
              return releaseDate >= dateRange.from;
            }
            return true;
          })
          .sort((a, b) => {
            const dateA = new Date(a.datetime);
            const dateB = new Date(b.datetime);
            return sortOrder === "asc" 
              ? dateA.getTime() - dateB.getTime()
              : dateB.getTime() - dateA.getTime();
          })}
        onReleaseClick={handleReleaseClick}
        onSaveRelease={handleSaveRelease}
        onDeleteRelease={handleDeleteRelease}
      />
    </div>
  );
}
