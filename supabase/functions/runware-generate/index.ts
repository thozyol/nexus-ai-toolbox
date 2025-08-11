// Supabase Edge Function: Runware image generation
// Uses RUNWARE_API_KEY stored in Supabase Secrets
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  } as Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders() });
  }

  try {
    const { positivePrompt, width = 1024, height = 1024, model = "runware:100@1", numberResults = 1 } = await req.json();

    if (!positivePrompt || typeof positivePrompt !== "string") {
      return new Response(JSON.stringify({ error: "positivePrompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const apiKey = Deno.env.get("RUNWARE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "RUNWARE_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const taskUUID = crypto.randomUUID();
    const body = [
      { taskType: "authentication", apiKey },
      {
        taskType: "imageInference",
        taskUUID,
        positivePrompt,
        width,
        height,
        model,
        numberResults,
      },
    ];

    const res = await fetch("https://api.runware.ai/v1", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ error: "Runware request failed", detail: txt }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    const data = await res.json();
    const item = data?.data?.find?.((d: any) => d.taskType === "imageInference" && d.imageURL);
    if (!item?.imageURL) {
      return new Response(JSON.stringify({ error: "No imageURL returned" }), {
        status: 502,
        headers: { "Content-Type": "application/json", ...corsHeaders() },
      });
    }

    return new Response(JSON.stringify({ imageURL: item.imageURL }), {
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Bad request", detail: String(e) }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
});
