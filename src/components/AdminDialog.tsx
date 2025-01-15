import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ReleaseNote } from "./ReleaseCard";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["feature", "bugfix", "enhancement"]),
  tags: z.string().min(1, "At least one tag is required"),
  datetime: z.string().min(1, "Date and time is required"),
});

interface AdminDialogProps {
  release?: ReleaseNote;
  onSave: (release: Partial<ReleaseNote>) => void;
}

export function AdminDialog({ release, onSave }: AdminDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: release?.title || "",
      description: release?.description || "",
      category: release?.category || "feature",
      tags: release?.tags.map(t => t.name).join(", ") || "",
      datetime: release?.datetime ? format(new Date(release.datetime), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const tags = values.tags.split(",").map((tag, index) => ({
      id: release?.tags[index]?.id || `new-${index}`,
      name: tag.trim(),
      color: release?.tags[index]?.color || "#2563eb",
    }));

    const updatedRelease = {
      ...release,
      ...values,
      tags,
      datetime: new Date(values.datetime).toISOString(),
      id: release?.id || `release-${Date.now()}`,
    };

    onSave(updatedRelease);
    setOpen(false);
    toast({
      title: release ? "Release updated" : "Release created",
      description: `Successfully ${release ? "updated" : "created"} the release note.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={release ? "outline" : "default"}>
          {release ? "Edit Release" : "New Release"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
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
                    <Textarea {...field} />
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
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. ui, performance, security" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              {release ? "Update Release" : "Create Release"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}