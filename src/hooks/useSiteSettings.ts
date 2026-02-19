import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  site_title: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  whatsapp_number: string;
  emergency_phone: string;
  google_analytics_id: string;
  social_facebook: string;
  social_instagram: string;
  social_linkedin: string;
  social_youtube: string;
}

const defaultSettings: SiteSettings = {
  site_title: "Dr. Nisarg Parmar - Neurosurgeon",
  site_description: "Expert neurosurgical care in Gujarat. Brain & spine specialist with 15+ years experience.",
  contact_phone: "+91 99099 07475",
  contact_email: "contact@drnisargparmar.com",
  whatsapp_number: "+919909907475",
  emergency_phone: "+91 99099 07475",
  google_analytics_id: "",
  social_facebook: "",
  social_instagram: "",
  social_linkedin: "",
  social_youtube: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase.from("site_settings").select("*");

      if (!error && data) {
        const settingsMap: Record<string, any> = {};
        data.forEach((item) => {
          settingsMap[item.key] = item.value;
        });

        setSettings({
          site_title: (settingsMap.site_title as string) || defaultSettings.site_title,
          site_description: (settingsMap.site_description as string) || defaultSettings.site_description,
          contact_phone: (settingsMap.contact_phone as string) || defaultSettings.contact_phone,
          contact_email: (settingsMap.contact_email as string) || defaultSettings.contact_email,
          whatsapp_number: (settingsMap.whatsapp_number as string) || defaultSettings.whatsapp_number,
          emergency_phone: (settingsMap.emergency_phone as string) || defaultSettings.emergency_phone,
          google_analytics_id: (settingsMap.google_analytics_id as string) || "",
          social_facebook: (settingsMap.social_facebook as string) || "",
          social_instagram: (settingsMap.social_instagram as string) || "",
          social_linkedin: (settingsMap.social_linkedin as string) || "",
          social_youtube: (settingsMap.social_youtube as string) || "",
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { settings, isLoading, refetch: fetchSettings };
}
