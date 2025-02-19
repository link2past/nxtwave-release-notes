
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { apiKey, listId } = await req.json()

    if (!apiKey || !listId) {
      throw new Error('API key and List ID are required')
    }

    const tasks = [];
    let page = 0;
    const PAGE_SIZE = 100; // ClickUp's default page size

    // Recursively fetch all tasks using pagination
    async function fetchTasksPage() {
      console.log(`Fetching page ${page}...`);
      const response = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task?page=${page}&subtasks=true&archived=false&include_closed=true&limit=${PAGE_SIZE}`, 
        {
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`ClickUp API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.tasks || data.tasks.length === 0) {
        console.log('No more tasks found.');
        return;
      }

      console.log(`Found ${data.tasks.length} tasks on page ${page}`);
      
      // Map and add tasks to our array
      tasks.push(...data.tasks.map((task: any) => ({
        id: task.id,
        name: task.name,
        status: task.status?.status || 'Unknown',
        dueDate: task.due_date,
        priority: task.priority?.priority || 'None'
      })));

      // If we got a full page of results, there might be more
      if (data.tasks.length === PAGE_SIZE) {
        page++;
        await fetchTasksPage(); // Recursively fetch next page
      }
    }

    // Start the recursive fetching process
    await fetchTasksPage();

    console.log(`Total tasks fetched: ${tasks.length}`);

    return new Response(
      JSON.stringify({ tasks }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
