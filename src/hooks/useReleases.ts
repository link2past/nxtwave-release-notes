
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ReleaseNote } from "@/components/ReleaseCard";
import { useToast } from "@/components/ui/use-toast";

export function useReleases() {
  const [releases, setReleases] = useState<ReleaseNote[]>([]);
  const { toast } = useToast();

  const fetchReleases = async () => {
    try {
      const { data: releasesData, error: releasesError } = await supabase
        .from('releases')
        .select(`
          *,
          media (*),
          release_tags (
            tag_id,
            tags (*)
          )
        `);

      if (releasesError) throw releasesError;

      const transformedReleases: ReleaseNote[] = releasesData.map(release => ({
        id: release.id,
        title: release.title,
        description: release.description,
        datetime: release.datetime,
        category: release.category as "feature" | "bugfix" | "enhancement",
        tags: release.release_tags.map(rt => rt.tags),
        media: release.media ? release.media.map(m => ({
          type: m.type as "image" | "video",
          url: m.url
        })) : undefined
      }));

      console.log('Fetched releases:', transformedReleases);
      setReleases(transformedReleases);
    } catch (error) {
      console.error('Error fetching releases:', error);
      toast({
        title: "Error",
        description: "Failed to fetch releases. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveRelease = async (updatedRelease: Partial<ReleaseNote>) => {
    try {
      let releaseId = updatedRelease.id;
      
      // Handle release upsert
      if (releaseId) {
        const { error: updateError } = await supabase
          .from('releases')
          .update({
            title: updatedRelease.title,
            description: updatedRelease.description,
            category: updatedRelease.category,
            datetime: updatedRelease.datetime
          })
          .eq('id', releaseId);

        if (updateError) throw updateError;
      } else {
        const { data: newRelease, error: insertError } = await supabase
          .from('releases')
          .insert({
            title: updatedRelease.title,
            description: updatedRelease.description,
            category: updatedRelease.category,
            datetime: updatedRelease.datetime
          })
          .select()
          .single();

        if (insertError) throw insertError;
        releaseId = newRelease.id;
      }

      // Handle tags
      if (updatedRelease.tags) {
        // Delete existing release tags
        if (releaseId) {
          await supabase
            .from('release_tags')
            .delete()
            .eq('release_id', releaseId);
        }

        // Insert new tags and release_tags
        for (const tag of updatedRelease.tags) {
          const { data: tagData, error: tagError } = await supabase
            .from('tags')
            .upsert({ 
              id: tag.id && !tag.id.startsWith('new-') ? tag.id : undefined,
              name: tag.name, 
              color: tag.color 
            })
            .select()
            .single();

          if (tagError) throw tagError;

          const { error: releaseTagError } = await supabase
            .from('release_tags')
            .insert({
              release_id: releaseId,
              tag_id: tagData.id
            });

          if (releaseTagError) throw releaseTagError;
        }
      }

      // Handle media
      if (updatedRelease.media) {
        if (releaseId) {
          await supabase
            .from('media')
            .delete()
            .eq('release_id', releaseId);
        }

        const mediaInserts = updatedRelease.media.map(media => ({
          release_id: releaseId,
          type: media.type,
          url: media.url
        }));

        const { error: mediaError } = await supabase
          .from('media')
          .insert(mediaInserts);

        if (mediaError) throw mediaError;
      }

      await fetchReleases();
      
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

  return {
    releases,
    fetchReleases,
    handleSaveRelease
  };
}
