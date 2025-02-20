
import { Button } from "./ui/button";
import { Link } from "lucide-react";
import { useToast } from "./ui/use-toast";

interface ShareButtonProps {
  slug: string;
}

export function ShareButton({ slug }: ShareButtonProps) {
  const { toast } = useToast();

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const shareableUrl = `${window.location.origin}/releases/${slug}`;
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

  return (
    <Button
      variant="outline"
      size="sm"
      className="copy-link-button font-playfair hover:bg-highlight-yellow/20"
      onClick={handleCopyLink}
    >
      <Link className="h-4 w-4 mr-2" />
      Copy Link
    </Button>
  );
}
