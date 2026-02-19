import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setServices(data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { services, isLoading, refetch: fetchServices };
}
