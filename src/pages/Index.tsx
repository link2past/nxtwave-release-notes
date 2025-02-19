
import { useState, useEffect } from "react";
import { type ReleaseNote } from "@/components/ReleaseCard";
import { Header } from "@/components/Header";
import { ReleaseList } from "@/components/ReleaseList";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths, parseISO } from "date-fns";
import { useReleases } from "@/hooks/useReleases";
import { ReleasesFilters } from "@/components/ReleasesFilters";
import { ReleaseModals } from "@/components/ReleaseModals";
import { DateRange } from "react-day-picker";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClickUpIntegration } from "@/components/ClickUpIntegration";

const ITEMS_PER_PAGE = 8;

export default function Index() {
  const { releases, fetchReleases, handleSaveRelease } = useReleases();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [maximizedMedia, setMaximizedMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchReleases();
  }, []);

  const handleDeleteRelease = async (id: string) => {
    try {
      const { error } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Release deleted",
        description: "The release note has been successfully deleted.",
      });

      fetchReleases(); // Refresh the list
    } catch (error) {
      console.error('Error deleting release:', error);
      toast({
        title: "Error",
        description: "Failed to delete the release note.",
        variant: "destructive",
      });
    }
  };

  const handleDateFilterChange = (value: string) => {
    setSelectedDateFilter(value);
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;

    switch (value) {
      case "today":
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case "currentMonth":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "lastMonth":
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(subMonths(now, 1));
        break;
      case "custom":
        return;
      default:
        setDateRange(undefined);
        return;
    }

    if (start && end) {
      setDateRange({ from: start, to: end });
    }
  };

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        search === "" ||
        release.title.toLowerCase().includes(search.toLowerCase()) ||
        release.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || release.category === category;

      const releaseDate = parseISO(release.datetime);
      const matchesDateRange = !dateRange?.from || !dateRange?.to || 
        (releaseDate >= dateRange.from && releaseDate <= dateRange.to);

      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredReleases.length / ITEMS_PER_PAGE);
  const paginatedReleases = filteredReleases.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <div className="mb-8 flex justify-between items-center">
          <Header onSaveRelease={handleSaveRelease} />
          <ClickUpIntegration />
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
          onDateFilterChange={handleDateFilterChange}
          onClear={() => {
            setSearch("");
            setCategory("all");
            setSortOrder("desc");
            setDateRange(undefined);
            setSelectedDateFilter("all");
          }}
        />

        <ReleaseList
          releases={paginatedReleases}
          onSaveRelease={handleSaveRelease}
          onReleaseClick={setSelectedRelease}
          onDeleteRelease={handleDeleteRelease}
        />

        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <ReleaseModals
          selectedRelease={selectedRelease}
          onCloseRelease={() => setSelectedRelease(null)}
          maximizedMedia={maximizedMedia}
          onCloseMedia={() => setMaximizedMedia(null)}
        />
      </div>
    </div>
  );
}
