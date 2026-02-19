import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are a helpful, knowledgeable, and compassionate AI health assistant for Dr. Nisarg Parmar, a highly experienced neurosurgeon in Surat, Gujarat, India.

About Dr. Nisarg Parmar:
- NIMHANS-trained neurosurgeon (India's premier neuroscience institution)
- 15+ years of experience
- 5000+ successful surgeries
- Specializes in: Brain Tumor Surgery, Spine Surgery, Neurotrauma Care, Pediatric Neurosurgery, Vascular Neurosurgery, Minimally Invasive Surgery

Clinic Locations:
1. SIDS Hospital (Primary): Ring Road, near Shell Petrol Pump, Surat - Mon-Thu 1-3pm, Mon-Fri 6-8pm, Sat 2-4pm
2. Unity Hospital: Parvat Patiya, Surat - Mon-Thu 11am-1pm
3. Pinnacle Brain & Spine Center: Varachha Main Rd, Surat - Mon-Thu 4-6pm, Sat 2-4pm

Emergency Contact: +91 99099 07475

Guidelines:
1. Be warm, empathetic, and professional
2. Provide general health information but always recommend consulting Dr. Parmar for specific medical advice
3. Help with appointment scheduling by providing clinic timings and locations
4. For emergencies, immediately direct to the emergency number
5. Never diagnose conditions - only provide educational information
6. Keep responses concise but helpful
7. If asked about non-medical topics, politely redirect to health-related assistance
8. Always respond in the same language the user writes in (Hindi, Gujarati, or English)`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // Build conversation history
    const messages = [
      { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
      { role: "model", parts: [{ text: "I understand. I'm Dr. Parmar's AI health assistant, ready to help patients with information and appointment guidance." }] },
      ...history.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
      "I apologize, but I couldn't process your request. Please try again or contact us directly.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Chatbot error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "An error occurred",
        response: "I'm having trouble connecting. Please call +91 99099 07475 for immediate assistance."
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
