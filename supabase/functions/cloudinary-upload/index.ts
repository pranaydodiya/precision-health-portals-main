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
    const { image, folder = "uploads" } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "Image data is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const CLOUDINARY_API_KEY = Deno.env.get("CLOUDINARY_API_KEY");
    if (!CLOUDINARY_API_KEY) {
      throw new Error("CLOUDINARY_API_KEY is not configured");
    }

    // Parse the API key (format: cloud_name:api_key:api_secret)
    const [cloudName, apiKey, apiSecret] = CLOUDINARY_API_KEY.split(":");
    
    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Invalid CLOUDINARY_API_KEY format. Expected: cloud_name:api_key:api_secret");
    }

    // Generate timestamp and signature for upload
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Create signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(signatureString);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    // Prepare form data
    const formData = new FormData();
    formData.append("file", image);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Cloudinary upload error:", errorText);
      throw new Error(`Cloudinary upload failed: ${uploadResponse.status}`);
    }

    const result = await uploadResponse.json();

    return new Response(
      JSON.stringify({
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Upload error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Upload failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
