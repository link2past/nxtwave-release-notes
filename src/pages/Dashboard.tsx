
import { useEffect, useState } from "react";
import { ReleaseList } from "@/components/ReleaseList";
import { ReleasesFilters } from "@/components/ReleasesFilters";
import { useReleases } from "@/hooks/useReleases";
import { DateRange } from "react-day-picker";
import { ReleaseNote } from "@/components/ReleaseCard";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
    fetchReleases();
  }, []);

  const handleDownloadFiltered = () => {
    try {
      // Filter releases based on current filters
      const filteredReleases = releases
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
        });

      // Sort releases
      filteredReleases.sort((a, b) => {
        const dateA = new Date(a.datetime);
        const dateB = new Date(b.datetime);
        return sortOrder === "asc" 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      });

      // Convert to CSV format
      const csvContent = [
        ["Title", "Description", "Category", "Date", "Tags", "Labels"].join(","),
        ...filteredReleases.map(release => [
          `"${release.title.replace(/"/g, '""')}"`,
          `"${release.description.replace(/"/g, '""')}"`,
          release.category,
          new Date(release.datetime).toISOString(),
          release.tags.map(t => t.name).join(";"),
          release.labels.map(l => l.name).join(";")
        ].join(","))
      ].join("\n");

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `release-notes-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Download successful",
        description: "Your filtered release notes have been downloaded as a CSV file.",
      });
    } catch (error) {
      console.error('Error downloading releases:', error);
      toast({
        title: "Download failed",
        description: "Failed to download release notes. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Release Notes Dashboard</h1>
        <Button
          onClick={handleDownloadFiltered}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download as CSV
        </Button>
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
