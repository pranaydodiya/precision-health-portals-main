import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ClinicLocation {
  id: string;
  name: string;
  address: string;
  city: string | null;
  phone: string | null;
  timing: string | null;
  map_url: string | null;
  is_active: boolean;
  display_order: number;
}

export function useClinicLocations() {
  const [locations, setLocations] = useState<ClinicLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("clinic_locations")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (!error && data) {
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { locations, isLoading, refetch: fetchLocations };
}
