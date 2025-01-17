import { useState } from "react";
import { ReleaseCard, type ReleaseNote } from "@/components/ReleaseCard";
import { SearchBar } from "@/components/SearchBar";
import { FilterBar } from "@/components/FilterBar";
import { AdminDialog } from "@/components/AdminDialog";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useUserRole } from "@/contexts/UserRoleContext";
import { RoleSelector } from "@/components/RoleSelector";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Index() {
  const [releases, setReleases] = useState<ReleaseNote[]>(initialReleases);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { theme, setTheme } = useTheme();
  const { role } = useUserRole();
  const [selectedRelease, setSelectedRelease] = useState<ReleaseNote | null>(null);

  const handleSaveRelease = (updatedRelease: Partial<ReleaseNote>) => {
    if (updatedRelease.id) {
      setReleases(prev =>
        prev.map(release =>
          release.id === updatedRelease.id
            ? { ...release, ...updatedRelease } as ReleaseNote
            : release
        )
      );
    } else {
      setReleases(prev => [(updatedRelease as ReleaseNote), ...prev]);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Release Notes
          </h1>
          <div className="flex items-center gap-4">
            <RoleSelector />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {role === 'admin' && <AdminDialog onSave={handleSaveRelease} />}
          </div>
        </div>
        
        <div className="space-y-6 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          
          <FilterBar
            category={category}
            sortOrder={sortOrder}
            onCategoryChange={setCategory}
            onSortChange={setSortOrder}
            onClear={() => {
              setSearch("");
              setCategory("all");
              setSortOrder("desc");
            }}
          />
        </div>

        <div className="grid gap-6">
          {filteredReleases.map((release) => (
            <div key={release.id} className="flex items-start gap-4 w-full">
              <div className="flex-1 cursor-pointer" onClick={() => setSelectedRelease(release)}>
                <ReleaseCard release={release} />
              </div>
              {role === 'admin' && (
                <AdminDialog release={release} onSave={handleSaveRelease} />
              )}
            </div>
          ))}
        </div>

        {filteredReleases.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No releases found matching your criteria
          </div>
        )}

        <Dialog open={!!selectedRelease} onOpenChange={() => setSelectedRelease(null)}>
          <DialogContent className="max-w-2xl">
            {selectedRelease && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">{selectedRelease.title}</h2>
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

// Sample data - in a real app this would come from an API
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
