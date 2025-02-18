import { format } from "date-fns";
import { useUserRole } from "@/contexts/UserRoleContext";
import { MediaDisplay } from "./MediaDisplay";
import { TagList } from "./TagList";
import { Trash2 } from "lucide-react";
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
import { Link } from "lucide-react";
import { useToast } from "./ui/use-toast";

export interface Tag {
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
  onClick?: () => void;
  onDelete?: (id: string) => void;
}

export function ReleaseCard({ release, onClick, onDelete }: ReleaseCardProps) {
  const { role } = useUserRole();
  const { toast } = useToast();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking delete button
    if ((e.target as HTMLElement).closest('.delete-button')) {
      e.stopPropagation();
      return;
    }
    onClick?.();
  };

  return (
    <div 
      className="w-full p-6 bg-card rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border/50 backdrop-blur-sm cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span 
            className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${categoryColors[release.category]}`}
          >
            {categoryLabels[release.category]}
          </span>
          <time className="text-sm text-muted-foreground">
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
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the release note.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(release.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-card-foreground">{release.title}</h3>
      <div 
        className="text-muted-foreground mb-4 leading-relaxed line-clamp-2 prose prose-sm dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: release.description }}
      />

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            const url = `${window.location.origin}/releases/${release.slug}`;
            navigator.clipboard.writeText(url);
            toast({
              title: "Link copied!",
              description: "The shareable link has been copied to your clipboard.",
            });
          }}
        >
          <Link className="h-4 w-4 mr-2" />
          Copy Link
        </Button>
      </div>

      {release.media && release.media.length > 0 && (
        <MediaDisplay media={release.media} />
      )}
      <TagList tags={release.tags} />
    </div>
  );
}
