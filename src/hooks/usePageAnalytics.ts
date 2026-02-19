import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function usePageAnalytics() {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from("page_analytics").insert({
          page_path: location.pathname,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        });
      } catch (error) {
        // Silently fail - analytics should not break the app
        console.debug("Analytics tracking failed:", error);
      }
    };

    // Small delay to ensure the page title is set
    const timer = setTimeout(trackPageView, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);
}
