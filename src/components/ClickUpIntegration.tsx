
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function ClickUpIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [listId, setListId] = useState("");
  const [tasks, setTasks] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchTasks = async () => {
    if (!apiKey || !listId) {
      toast({
        title: "Missing information",
        description: "Please provide both API key and List ID",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-clickup-tasks', {
        body: { apiKey, listId }
      });

      if (error) throw error;

      setTasks(data.tasks);
      toast({
        title: "Success!",
        description: "Tasks fetched successfully",
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please check your API key and List ID.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Connect ClickUp</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ClickUp Integration</DialogTitle>
          <DialogDescription>
            Enter your ClickUp API key and List ID to fetch tasks.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your ClickUp API key"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="listId" className="text-sm font-medium">
              List ID
            </label>
            <Input
              id="listId"
              value={listId}
              onChange={(e) => setListId(e.target.value)}
              placeholder="Enter your ClickUp List ID"
            />
          </div>
          <Button onClick={handleFetchTasks} disabled={loading}>
            {loading ? "Fetching tasks..." : "Fetch Tasks"}
          </Button>
        </div>
        {tasks.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Tasks:</h3>
            <div className="max-h-[200px] overflow-y-auto">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-2 border-b last:border-b-0 text-sm"
                >
                  {task.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
