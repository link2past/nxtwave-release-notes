import { useState } from "react";
import { type ReleaseNote } from "@/components/ReleaseCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Header } from "@/components/Header";
import { FiltersSection } from "@/components/FiltersSection";
import { ReleaseList } from "@/components/ReleaseList";

export default function Index() {
  const [releases, setReleases] = useState<ReleaseNote[]>(initialReleases);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);

  const handleSaveRelease = (updatedRelease: Partial<ReleaseNote>) => {
    if (updatedRelease.id) {
      // Update existing release
      setReleases(prev =>
        prev.map(release =>
          release.id === updatedRelease.id
            ? { ...release, ...updatedRelease } as ReleaseNote
            : release
        )
      );
    } else {
      // Add new release at the beginning of the list
      setReleases(prev => [{ ...updatedRelease as ReleaseNote }, ...prev]);
    }
  };

  const filteredReleases = releases
    .filter((release) => {
      const matchesSearch =
        search === "" ||
        release.title.toLowerCase().includes(search.toLowerCase()) ||
        release.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = category === "all" || release.category === category;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const dateA = new Date(a.datetime).getTime();
      const dateB = new Date(b.datetime).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="container py-8 px-4 mx-auto max-w-6xl">
        <Header onSaveRelease={handleSaveRelease} />
        
        <FiltersSection
          search={search}
          category={category}
          sortOrder={sortOrder}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortChange={setSortOrder}
          onClear={() => {
            setSearch("");
            setCategory("all");
            setSortOrder("desc");
          }}
        />

        <ReleaseList
          releases={filteredReleases}
          onSaveRelease={handleSaveRelease}
          onReleaseClick={setSelectedRelease}
        />

        <Dialog open={!!selectedRelease} onOpenChange={() => setSelectedRelease(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRelease && (
              <div className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{selectedRelease.title}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">{selectedRelease.description}</p>
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
