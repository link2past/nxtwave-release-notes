
import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { MediaDisplay } from "./MediaDisplay";
import { TagList } from "./TagList";
import { Trash2, Link } from "lucide-react";
import { Button } from "./ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "./ui/use-toast";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  datetime: string;
  category: "feature" | "bugfix" | "enhancement";
  tags: Tag[];
  labels: Label[];
  slug: string;
  media?: {
    type: "image" | "video";
    url: string;
  }[];
}

const categoryColors = {
  feature: "bg-emerald-500 text-white",
  bugfix: "bg-red-500 text-white",
  enhancement: "bg-purple-500 text-white",
} as const;

const categoryLabels = {
  feature: "Feature",
  bugfix: "Bug Fix",
  enhancement: "Enhancement",
} as const;

interface ReleaseCardProps {
  release: ReleaseNote;
  onClick?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export function ReleaseCard({ release, onClick, onDelete }: ReleaseCardProps) {
  const { role } = useUserRole();
  const { toast } = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.delete-button, .copy-link-button, [role="dialog"]')) {
      return;
    }
    onClick?.(e);
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const shareableUrl = `${window.location.origin}/releases/${release.slug}`;
      await navigator.clipboard.writeText(shareableUrl);
      
      toast({
        title: "Link copied!",
        description: "The shareable link has been copied to your clipboard.",
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
      toast({
        title: "Failed to copy link",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(e);
  };

  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${categoryColors[release.category]}`}
          >
            {categoryLabels[release.category]}
          </span>
          <time className="text-sm text-muted-foreground font-playfair italic">
            {format(new Date(release.datetime), "MMM d, yyyy HH:mm")}
          </time>
        </div>
        {role === 'admin' && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="delete-button absolute top-2 right-2 text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the release note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <h3 className="text-xl font-playfair font-semibold mb-3 text-highlight-purple group-hover:text-highlight-purple/90 transition-colors">
        {release.title}
      </h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert font-playfair"
        dangerouslySetInnerHTML={{ __html: release.description }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          className="copy-link-button font-playfair hover:bg-highlight-yellow/20"
          onClick={handleCopyLink}
        >
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>

      {release.media && release.media.length > 0 && (
        <MediaDisplay media={release.media} />
      )}

      <div className="space-y-3">
        {release.labels && release.labels.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 font-playfair">Labels</h4>
            <div className="flex flex-wrap gap-2">
              {release.labels.map((label) => (
                <span
                  key={label.id}
                  className="px-3 py-1 text-xs rounded-full transition-colors duration-200 font-playfair"
                  style={{ 
                    backgroundColor: `${label.color}20`, 
                    color: label.color,
                    boxShadow: `0 1px 2px ${label.color}10`
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {release.tags && release.tags.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 font-playfair">Tags</h4>
            <TagList tags={release.tags} />
          </div>
        )}
      </div>
    </div>
  );
}
