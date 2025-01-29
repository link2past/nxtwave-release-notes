import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";

interface MediaItem {
  type: "image" | "video";
  url: string;
}

interface MediaDisplayProps {
  media: MediaItem[];
}

export function MediaDisplay({ media }: MediaDisplayProps) {
  const [maximizedMedia, setMaximizedMedia] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="mb-4 space-y-2">
        {media.map((item, index) => (
          <div 
            key={index}
            className="relative group cursor-pointer" 
            onClick={() => setMaximizedMedia(item)}
          >
            {item.type === 'image' ? (
              <img 
                src={item.url}
                alt=""
                className="rounded-md max-h-48 object-cover w-full group-hover:opacity-90 transition-opacity"
              />
            ) : (
              <video 
                src={item.url}
                controls
                className="rounded-md max-h-48 w-full group-hover:opacity-90 transition-opacity"
              />
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">Click to maximize</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!maximizedMedia} onOpenChange={() => setMaximizedMedia(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          {maximizedMedia && (
            <div className="relative w-full h-full flex items-center justify-center">
              {maximizedMedia.type === 'image' ? (
                <img 
                  src={maximizedMedia.url}
                  alt=""
                  className="max-w-full max-h-[85vh] object-contain"
                />
              ) : (
                <video 
                  src={maximizedMedia.url}
                  controls
                  className="max-w-full max-h-[85vh]"
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}