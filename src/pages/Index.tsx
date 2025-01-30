import { useState } from "react";
import { format } from "date-fns";
import { type ReleaseNote } from "@/components/ReleaseCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { FiltersSection } from "@/components/FiltersSection";
import { ReleaseList } from "@/components/ReleaseList";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 8;

export default function Index() {
  const [releases, setReleases] = useState<ReleaseNote[]>(initialReleases);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [maximizedMedia, setMaximizedMedia] = useState<{ type: "image" | "video"; url: string } | null>(null);
  const [selectedDateFilter, setSelectedDateFilter] = useState("all"); // Set default value
  const { toast } = useToast();

  const handleSaveRelease = async (updatedRelease: Partial<ReleaseNote>) => {
    try {
      if (updatedRelease.id) {
        setReleases(prev =>
          prev.map(release =>
            release.id === updatedRelease.id
              ? { ...release, ...updatedRelease } as ReleaseNote
              : release
          )
        );
      } else {
        const newRelease = {
          ...updatedRelease,
          id: `release-${Date.now()}`,
        } as ReleaseNote;
        
        setReleases(prevReleases => [newRelease, ...prevReleases]);
      }
      
      // Force a re-render
      setCurrentPage(1); // Reset to first page to show new release
      
      toast({
        title: updatedRelease.id ? "Release updated" : "Release created",
        description: `Successfully ${updatedRelease.id ? "updated" : "created"} the release note.`,
      });

      return Promise.resolve();
    } catch (error) {
      console.error('Error saving release:', error);
      toast({
        title: "Error",
        description: "Failed to save the release note. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  const handleDateFilterChange = (value: string) => {
    setSelectedDateFilter(value);
    const now = new Date();
    let start: Date;
    let end: Date;

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
        setDateRange({ start: "", end: "" });
        return;
    }

    if (start && end) {
      setDateRange({
        start: start.toISOString(),
        end: end.toISOString(),
      });
    }
  };

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        search === "" ||
        release.title.toLowerCase().includes(search.toLowerCase()) ||
        release.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || release.category === category;

      const matchesDateRange = 
        (!dateRange.start || new Date(release.datetime) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(release.datetime) <= new Date(dateRange.end));

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
        <Header onSaveRelease={handleSaveRelease} />
        
        <FiltersSection
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
            setDateRange({ start: "", end: "" });
            setSelectedDateFilter("all");
          }}
        />

        <ReleaseList
          releases={paginatedReleases}
          onSaveRelease={handleSaveRelease}
          onReleaseClick={setSelectedRelease}
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

        <Dialog open={!!selectedRelease} onOpenChange={() => setSelectedRelease(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRelease && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{selectedRelease.title}</DialogTitle>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                      selectedRelease.category === 'feature' ? 'bg-emerald-500 text-white' :
                      selectedRelease.category === 'bugfix' ? 'bg-red-500 text-white' :
                      'bg-purple-500 text-white'
                    }`}>
                      {selectedRelease.category.charAt(0).toUpperCase() + selectedRelease.category.slice(1)}
                    </span>
                    <time>
                      Released on {format(new Date(selectedRelease.datetime), "MMMM d, yyyy 'at' HH:mm")}
                    </time>
                  </div>
                </DialogHeader>
                
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedRelease.description }} />
                </div>

                {selectedRelease.media && selectedRelease.media.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold">Media</h4>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                      {selectedRelease.media.map((item, index) => (
                        <div key={index} className="relative group cursor-pointer" onClick={() => setMaximizedMedia(item)}>
                          {item.type === 'image' ? (
                            <img 
                              src={item.url}
                              alt=""
                              className="rounded-md max-h-48 object-cover w-full group-hover:opacity-90 transition-opacity"
                            />
                          ) : (
                            <video 
                              src={item.url}
                              controls
                              className="rounded-md max-h-48 w-full group-hover:opacity-90 transition-opacity"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">Click to maximize</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRelease.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 text-xs rounded-full transition-colors duration-200"
                        style={{ 
                          backgroundColor: `${tag.color}20`, 
                          color: tag.color,
                          boxShadow: `0 1px 2px ${tag.color}10`
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={!!maximizedMedia} onOpenChange={() => setMaximizedMedia(null)}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
            {maximizedMedia && (
              <div className="relative w-full h-full flex items-center justify-center">
                {maximizedMedia.type === 'image' ? (
                  <img 
                    src={maximizedMedia.url}
                    alt=""
                    className="max-w-full max-h-[85vh] object-contain"
                  />
                ) : (
                  <video 
                    src={maximizedMedia.url}
                    controls
                    className="max-w-full max-h-[85vh]"
                  />
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

const initialReleases: ReleaseNote[] = [
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
];
