
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
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useReleases } from "@/hooks/useReleases";

interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  dueDate: string | null;
  priority: string;
}

export function ClickUpIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [listId, setListId] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const { handleSaveRelease, fetchReleases } = useReleases();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log('Selected date:', selectedDate);
    setDate(selectedDate);
  };

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
      console.log('Fetching tasks with date:', date?.toISOString());
      const { data, error } = await supabase.functions.invoke('fetch-clickup-tasks', {
        body: { 
          apiKey, 
          listId,
          startDate: date ? date.toISOString() : null
        }
      });

      if (error) throw error;

      if (!data.tasks || data.tasks.length === 0) {
        setTasks([]);
        toast({
          title: "No tasks found",
          description: "No tasks were found for the given criteria.",
          variant: "destructive",
        });
        return;
      }

      console.log('Fetched tasks:', data.tasks);
      setTasks(data.tasks);
      toast({
        title: "Success!",
        description: `${data.tasks.length} tasks fetched successfully`,
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

  const handleCreateRelease = async (task: Task) => {
    if (!task.name) {
      toast({
        title: "Invalid task data",
        description: "Task must have a title.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating release from task:', task);
      await handleSaveRelease({
        title: task.name,
        description: task.description || "", // Optional description
        datetime: task.dueDate ? new Date(parseInt(task.dueDate)).toISOString() : new Date().toISOString(),
        category: "feature",
        tags: [],
        labels: [],
      });

      await fetchReleases();

      toast({
        title: "Success",
        description: "Release created from task successfully",
      });
    } catch (error) {
      console.error('Error creating release:', error);
      toast({
        title: "Error",
        description: "Failed to create release from task. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "urgent":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "normal":
        return "bg-blue-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>Connect ClickUp</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh]">
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
          <div className="grid gap-2">
            <label className="text-sm font-medium">Filter by Start Date (Optional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {date && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-1"
                onClick={() => setDate(undefined)}
              >
                Clear date
              </Button>
            )}
          </div>
          <Button onClick={handleFetchTasks} disabled={loading}>
            {loading ? "Fetching tasks..." : "Fetch Tasks"}
          </Button>
        </div>
        {tasks.length > 0 ? (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Tasks ({tasks.length}):</h3>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium">{task.name}</p>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{task.status}</Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Due: {new Date(parseInt(task.dueDate)).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <Button 
                    onClick={() => handleCreateRelease(task)}
                    variant="secondary"
                    size="sm"
                    className="mt-2"
                  >
                    Create Release
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {loading ? "Loading tasks..." : "No tasks found"}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
