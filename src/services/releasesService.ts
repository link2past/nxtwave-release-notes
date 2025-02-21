
import { supabase } from "@/integrations/supabase/client";
import { ReleaseNote } from "@/types/release";
import { ReleasesApi, SaveReleaseResponse, DeleteReleaseResponse } from "@/types/releases";

export const releasesService: ReleasesApi = {
  fetchReleases: async () => {
    const { data: releasesData, error: releasesError } = await supabase
      .from('releases')
      .select(`
        *,
        media (*),
        release_tags (
          tag_id,
          tags (*)
        ),
        release_labels (
          label_id,
          labels (*)
        )
      `);

    if (releasesError) throw releasesError;

    return releasesData.map(release => ({
      id: release.id,
      title: release.title,
      description: release.description,
      datetime: release.datetime,
      category: release.category as "feature" | "bugfix" | "enhancement",
      tags: release.release_tags.map(rt => rt.tags),
      labels: release.release_labels ? release.release_labels.map(rl => rl.labels) : [],
      media: release.media ? release.media.map(m => ({
        type: m.type as "image" | "video",
        url: m.url
      })) : undefined,
      slug: release.slug || `${release.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${release.id.slice(0, 8)}`
    }));
  },

  saveRelease: async (updatedRelease: Partial<ReleaseNote>): Promise<SaveReleaseResponse> => {
    try {
      const slug = updatedRelease.title
        ?.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + 
        (updatedRelease.id?.slice(0, 8) || crypto.randomUUID().slice(0, 8));

      const releaseData = {
        title: updatedRelease.title,
        description: updatedRelease.description,
        category: updatedRelease.category,
        datetime: updatedRelease.datetime,
        slug
      };

      let releaseId: string;
      
      if (updatedRelease.id && !updatedRelease.id.startsWith('new-')) {
        const { error: updateError } = await supabase
          .from('releases')
          .update(releaseData)
          .eq('id', updatedRelease.id);

        if (updateError) throw updateError;
        releaseId = updatedRelease.id;
      } else {
        const { data: newRelease, error: insertError } = await supabase
          .from('releases')
          .insert(releaseData)
          .select()
          .single();

        if (insertError) throw insertError;
        if (!newRelease) throw new Error('No release was created');
        releaseId = newRelease.id;
      }

      // Handle tags
      if (updatedRelease.tags) {
        await supabase
          .from('release_tags')
          .delete()
          .eq('release_id', releaseId);

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
          if (!tagData) throw new Error('No tag was created');

          const { error: releaseTagError } = await supabase
            .from('release_tags')
            .insert({
              release_id: releaseId,
              tag_id: tagData.id
            });

          if (releaseTagError) throw releaseTagError;
        }
      }

      // Handle labels
      if (updatedRelease.labels) {
        await supabase
          .from('release_labels')
          .delete()
          .eq('release_id', releaseId);

        for (const label of updatedRelease.labels) {
          const { data: labelData, error: labelError } = await supabase
            .from('labels')
            .upsert({ 
              id: label.id && !label.id.startsWith('new-') ? label.id : undefined,
              name: label.name, 
              color: label.color 
            })
            .select()
            .single();

          if (labelError) throw labelError;
          if (!labelData) throw new Error('No label was created');

          const { error: releaseLabelError } = await supabase
            .from('release_labels')
            .insert({
              release_id: releaseId,
              label_id: labelData.id
            });

          if (releaseLabelError) throw releaseLabelError;
        }
      }

      // Handle media
      if (updatedRelease.media) {
        await supabase
          .from('media')
          .delete()
          .eq('release_id', releaseId);

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

      return { success: true };
    } catch (error) {
      console.error('Error saving release:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  },

  deleteRelease: async (id: string): Promise<DeleteReleaseResponse> => {
    try {
      console.log('Deleting release with ID:', id);
      
      // First, delete related records
      await Promise.all([
        supabase.from('release_tags').delete().eq('release_id', id),
        supabase.from('release_labels').delete().eq('release_id', id),
        supabase.from('media').delete().eq('release_id', id)
      ]);
      
      // Then delete the release itself
      const { error: deleteError } = await supabase
        .from('releases')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('Error deleting release:', deleteError);
        throw deleteError;
      }

      console.log('Successfully deleted release:', id);
      return { success: true };
    } catch (error) {
      console.error('Error in deleteRelease:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }
};
