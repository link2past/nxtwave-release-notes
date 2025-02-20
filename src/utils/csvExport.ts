
import { ReleaseNote } from "@/types/release";
import { toast } from "@/components/ui/use-toast";

const stripHtml = (html: string) => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const downloadReleasesAsCSV = (releases: ReleaseNote[]) => {
  try {
    // Include all relevant fields
    const headers = ["Title", "Description", "Category", "Date", "Tags", "Labels"];
    const csvContent = [
      headers.join(","),
      ...releases.map(release => [
        `"${release.title.replace(/"/g, '""')}"`,
        `"${stripHtml(release.description).replace(/"/g, '""')}"`,
        `"${release.category}"`,
        `"${new Date(release.datetime).toLocaleString()}"`,
        `"${release.tags.map(tag => tag.name).join(', ')}"`,
        `"${release.labels.map(label => label.name).join(', ')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob(['\ufeff' + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
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
