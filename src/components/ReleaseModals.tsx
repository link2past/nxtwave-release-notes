import { ReleaseNote } from "@/types/release";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { format } from "date-fns";

interface ReleaseModalsProps {
  selectedRelease: ReleaseNote | null;
  onCloseRelease: () => void;
  maximizedMedia: { type: "image" | "video"; url: string } | null;
  onCloseMedia: () => void;
}

export function ReleaseModals({
  selectedRelease,
  onCloseRelease,
  maximizedMedia,
  onCloseMedia
}: ReleaseModalsProps) {
  return (
    <>
      <Dialog open={!!selectedRelease} onOpenChange={() => onCloseRelease()}>
        <DialogContent className="max-w-[80vw] w-full">
          {selectedRelease && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">{selectedRelease.title}</DialogTitle>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ${
                    selectedRelease.category === 'feature' ? 'bg-emerald-500 text-white' :
                    selectedRelease.category === 'bugfix' ? 'bg-red-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>
                    {selectedRelease.category.charAt(0).toUpperCase() + selectedRelease.category.slice(1)}
                  </span>
                  <time>
                    Released on {format(new Date(selectedRelease.datetime), "MMMM d, yyyy 'at' HH:mm")}
                  </time>
                </div>
              </DialogHeader>
              
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: selectedRelease.description }} />
              </div>

              {selectedRelease.media && selectedRelease.media.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold">Media</h4>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {selectedRelease.media.map((item, index) => (
                      <div key={index} className="relative group cursor-pointer" onClick={() => onCloseMedia()}>
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
                </div>
              )}

              <div className="pt-4 border-t border-border">
                <h4 className="text-sm font-semibold mb-3">Tags</h4>
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!maximizedMedia} onOpenChange={() => onCloseMedia()}>
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
