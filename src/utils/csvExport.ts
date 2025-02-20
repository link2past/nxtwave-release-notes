
import { ReleaseNote } from "@/types/release";
import { toast } from "@/components/ui/use-toast";

export const downloadReleasesAsCSV = (releases: ReleaseNote[]) => {
  try {
    const headers = ["Title", "Description", "Category", "Date"];
    const csvContent = [
      headers.join(","),
      ...releases.map(release => [
        `"${release.title.replace(/"/g, '""')}"`,
        `"${release.description.replace(/"/g, '""')}"`,
        release.category,
        new Date(release.datetime).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `release_notes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Download complete",
      description: "Release notes have been downloaded as CSV.",
    });
  } catch (error) {
    console.error('Error downloading CSV:', error);
    toast({
      title: "Download failed",
      description: "Failed to download release notes. Please try again.",
      variant: "destructive",
    });
  }
};
