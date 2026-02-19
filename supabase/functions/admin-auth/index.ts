import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// CRITICAL: Admin credentials are validated server-side only
const ADMIN_EMAIL = "pranaydodiya2005@gmail.com";
const ADMIN_PASSWORD = "Pranay123";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, action } = await req.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (action === "login") {
      // Server-side credential validation - fast check first
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return new Response(
          JSON.stringify({ error: "Invalid credentials" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Try to sign in directly first (faster path)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });

      if (signInError) {
        // User might not exist, try to create
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
          email_confirm: true,
        });

        if (createError && !createError.message.includes("already")) {
          console.error("Error creating admin user:", createError);
          return new Response(
            JSON.stringify({ error: "Failed to initialize admin" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Try sign in again
        const { data: retrySignIn, error: retryError } = await supabase.auth.signInWithPassword({
          email: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        });

        if (retryError) {
          return new Response(
            JSON.stringify({ error: "Authentication failed" }),
            { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // Ensure admin role
        const userId = newUser?.user?.id || retrySignIn?.user?.id;
        if (userId) {
          await supabase.from("user_roles").upsert(
            { user_id: userId, role: "admin" },
            { onConflict: 'user_id,role' }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            session: retrySignIn.session,
            user: { id: retrySignIn.user.id, email: retrySignIn.user.email, role: "admin" },
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check/ensure admin role exists
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", signInData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        await supabase.from("user_roles").upsert(
          { user_id: signInData.user.id, role: "admin" },
          { onConflict: 'user_id,role' }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          session: signInData.session,
          user: { id: signInData.user.id, email: signInData.user.email, role: "admin" },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "verify") {
      const authHeader = req.headers.get("Authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "No token provided" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const token = authHeader.replace("Bearer ", "");
      const { data: userData, error: verifyError } = await supabase.auth.getUser(token);

      if (verifyError || !userData.user) {
        return new Response(
          JSON.stringify({ error: "Invalid token" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check admin role
      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        return new Response(
          JSON.stringify({ error: "Not an admin" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          user: { id: userData.user.id, email: userData.user.email, role: "admin" },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Admin auth error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
