
import { useState } from "react";
import { ReleaseNote } from "@/types/release";
import { useToast } from "@/components/ui/use-toast";
import { releasesService } from "@/services/releasesService";

export function useReleases() {
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const { toast } = useToast();

  const fetchReleases = async () => {
    try {
      console.log('Fetching releases...');
      const fetchedReleases = await releasesService.fetchReleases();
      console.log('Fetched releases:', fetchedReleases);
      setReleases(fetchedReleases);
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch releases. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveRelease = async (release: Partial<ReleaseNote>) => {
    try {
      console.log('Saving release:', release);
      const result = await releasesService.saveRelease(release);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Release saved successfully');
      
      // Immediately fetch updated releases list
      await fetchReleases();
      
      toast({
        title: release.id ? "Release updated" : "Release created",
        description: `Successfully ${release.id ? "updated" : "created"} the release note.`,
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

  const handleDeleteRelease = async (id: string): Promise<void> => {
    try {
      console.log('Attempting to delete release:', id);
      
      const result = await releasesService.deleteRelease(id);
      
      if (!result.success) {
        throw new Error(result.error);
      }

      console.log('Release deleted successfully:', id);
      
      // Update the local state immediately
      setReleases(prevReleases => prevReleases.filter(release => release.id !== id));
      
      toast({
        title: "Success",
        description: "Release deleted successfully",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error deleting release:', error);
      toast({
        title: "Error",
        description: "Failed to delete the release. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  return {
    releases,
    fetchReleases,
    handleSaveRelease,
    handleDeleteRelease,
  };
}
