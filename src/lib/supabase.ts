import { supabase } from "@/integrations/supabase/client";

export { supabase };

// Admin authentication - uses direct Supabase auth for speed and reliability
export async function adminLogin(email: string, password: string) {
  // Direct Supabase sign-in - fastest approach
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error("Authentication failed");
  }

  // Verify user has admin role
  const { data: roleData, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (roleError) {
    await supabase.auth.signOut();
    throw new Error("Failed to verify admin status");
  }

  if (!roleData) {
    await supabase.auth.signOut();
    throw new Error("Unauthorized: Admin access required");
  }

  return {
    success: true,
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      role: roleData.role,
    },
    session: authData.session,
  };
}

export async function verifyAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }

  // Check if user has admin role
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", session.user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email!,
    role: roleData.role,
  };
}

export async function adminLogout() {
  await supabase.auth.signOut();
}
