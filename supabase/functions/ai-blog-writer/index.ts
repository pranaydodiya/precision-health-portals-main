import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, topic, content, keywords } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    let prompt = "";

    switch (action) {
      case "generate-ideas":
        prompt = `You are an SEO expert for a neurosurgeon's medical blog. Generate 5 trending, SEO-friendly blog post ideas related to neurosurgery and brain/spine health.

For each idea, provide:
1. Title (SEO optimized, under 60 characters)
2. Brief description (2-3 sentences)
3. Target keywords (3-5 keywords)
4. Search intent (informational/navigational/transactional)

Format as JSON array with keys: title, description, keywords, intent

Topic focus: ${topic || "general neurosurgery and brain health"}`;
        break;

      case "generate-content":
        prompt = `You are an expert medical content writer specializing in neurosurgery. Write a comprehensive, SEO-optimized blog post.

Topic: ${topic}
Target Keywords: ${keywords || "neurosurgery, brain health, spine care"}

Requirements:
1. Write in a professional yet accessible tone
2. Include proper headings (H2, H3) using markdown
3. Aim for 1000-1500 words
4. Include an engaging introduction
5. Add practical, actionable information
6. Include a conclusion with a call to action to book an appointment
7. Make it medically accurate but understandable for patients
8. Include relevant internal linking suggestions

Format the content in markdown.`;
        break;

      case "generate-meta":
        prompt = `You are an SEO specialist. Generate SEO metadata for this blog post about neurosurgery.

Content: ${content?.substring(0, 2000)}
Topic: ${topic}

Generate:
1. meta_title (under 60 characters, include main keyword)
2. meta_description (under 160 characters, compelling with CTA)
3. slug (URL-friendly, lowercase, hyphens)
4. excerpt (2-3 sentences summary)
5. tags (5-7 relevant tags as array)
6. faq_schema (3-5 FAQ items as array with question and answer)

Format as JSON object.`;
        break;

      case "improve-content":
        prompt = `You are an expert medical editor. Improve this blog content for better SEO and readability.

Current Content:
${content}

Improvements needed:
1. Better keyword integration
2. Improved readability
3. More engaging headings
4. Better flow and structure
5. Add transition sentences
6. Ensure medical accuracy
7. Optimize for featured snippets

Provide the improved content in markdown format.`;
        break;

      default:
        throw new Error("Invalid action");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to parse JSON responses
    let result = aiResponse;
    if (action === "generate-ideas" || action === "generate-meta") {
      try {
        // Extract JSON from the response
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonMatch) {
          result = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // Return raw text if JSON parsing fails
        result = aiResponse;
      }
    }

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("AI Blog Writer error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
