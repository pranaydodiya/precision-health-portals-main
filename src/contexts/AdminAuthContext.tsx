import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { adminLogin, verifyAdminSession, adminLogout } from "@/lib/supabase";
import { supabase } from "@/integrations/supabase/client";

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check initial session
    const checkSession = async () => {
      try {
        const user = await verifyAdminSession();
        if (mounted) {
          setAdmin(user);
          setIsLoading(false);
        }
      } catch {
        if (mounted) {
          setAdmin(null);
          setIsLoading(false);
        }
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === "SIGNED_OUT") {
          if (mounted) setAdmin(null);
        } else if (event === "SIGNED_IN") {
          const user = await verifyAdminSession();
          if (mounted) setAdmin(user);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const result = await adminLogin(email, password);
    setAdmin(result.user);
  };

  const logout = async () => {
    await adminLogout();
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, isLoading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
