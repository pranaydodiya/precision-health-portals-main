import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VideoTestimonial {
  id: string;
  patient_name: string;
  condition: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_published: boolean;
  display_order: number;
}

export function useVideoTestimonials() {
  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from("video_testimonials")
        .select("*")
        .eq("is_published", true)
        .order("display_order");

      if (!error && data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { testimonials, isLoading, refetch: fetchTestimonials };
}
