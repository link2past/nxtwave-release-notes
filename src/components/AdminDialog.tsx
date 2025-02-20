
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReleaseNote, Tag } from "./ReleaseCard";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { RichTextEditor } from "./RichTextEditor";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["feature", "bugfix", "enhancement"]),
  selectedTag: z.string().optional(),
  datetime: z.string().min(1, "Date and time is required"),
  media: z.array(z.object({
    type: z.enum(["image", "video"]),
    url: z.string()
  })).optional()
});

interface AdminDialogProps {
  release?: ReleaseNote;
  onSave: (release: Partial<ReleaseNote>) => void;
}

export function AdminDialog({ release, onSave }: AdminDialogProps) {
  const [open, setOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: release?.title || "",
      description: release?.description || "",
      category: release?.category || "feature",
      datetime: release?.datetime ? format(new Date(release.datetime), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
      media: release?.media || []
    },
  });

  useEffect(() => {
    if (open) {
      // Fetch available tags from the database
      const fetchTags = async () => {
        const { data: tags, error } = await supabase
          .from('tags')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching tags:', error);
          return;
        }

        setAvailableTags(tags);

        // If editing, set the selected tags
        if (release?.tags) {
          setSelectedTags(release.tags);
        } else {
          setSelectedTags([]);
        }
      };

      fetchTags();
    }
  }, [open, release]);

  const handleTagSelect = (tagId: string) => {
    const tag = availableTags.find(t => t.id === tagId);
    if (tag && !selectedTags.some(t => t.id === tag.id)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));
  };

  const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newMediaFiles = Array.from(files).map(file => ({
        type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
        url: URL.createObjectURL(file)
      }));
      
      form.setValue('media', [...(form.getValues('media') || []), ...newMediaFiles]);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updatedRelease: Partial<ReleaseNote> = {
        ...release,
        ...values,
        tags: selectedTags,
        datetime: new Date(values.datetime).toISOString(),
        media: values.media?.map(m => ({
          type: m.type as "image" | "video",
          url: m.url
        }))
      };

      await onSave(updatedRelease);
      
      form.reset();
      setSelectedTags([]);
      setOpen(false);
      
      toast({
        title: release ? "Release updated" : "Release created",
        description: `Successfully ${release ? "updated" : "created"} the release note.`,
      });
    } catch (error) {
      console.error('Error saving release:', error);
      toast({
        title: "Error",
        description: "Failed to save the release note. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={release ? "outline" : "default"} onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}>
          {release ? "Edit Release" : "New Release"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[80vw] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>{release ? "Edit Release" : "Create New Release"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor
                      content={field.value}
                      onChange={field.onChange}
                      onImageUpload={async (file) => {
                        const { data, error } = await supabase.storage
                          .from('media')
                          .upload(`releases/${crypto.randomUUID()}-${file.name}`, file);

                        if (error) {
                          throw error;
                        }

                        const { data: { publicUrl } } = supabase.storage
                          .from('media')
                          .getPublicUrl(data.path);

                        return publicUrl;
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datetime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Release Date & Time</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="feature">Feature</SelectItem>
                      <SelectItem value="bugfix">Bug Fix</SelectItem>
                      <SelectItem value="enhancement">Enhancement</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="selectedTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleTagSelect(value);
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tags" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <ScrollArea className="h-[200px]">
                        {availableTags.map((tag) => (
                          <SelectItem key={tag.id} value={tag.id}>
                            {tag.name}
                          </SelectItem>
                        ))}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => removeTag(tag.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>Media (Images/Videos)</FormLabel>
              <Input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaUpload}
                className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors"
              />
            </FormItem>
            <Button type="submit" className="w-full">
              {release ? "Update Release" : "Create Release"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
