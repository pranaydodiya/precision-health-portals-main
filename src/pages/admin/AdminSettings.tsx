import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Save,
  Loader2,
  Settings,
  Globe,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SiteSettings {
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

export default function AdminSettings() {
  const { admin, isLoading: authLoading, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchSettings();
    }
  }, [admin]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("*");

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

  const saveSettings = async () => {
    setIsSaving(true);

    try {
      // Upsert each setting
      const settingsEntries = Object.entries(settings);
      
      for (const [key, value] of settingsEntries) {
        await supabase.from("site_settings").upsert(
          { key, value: value as any },
          { onConflict: 'key' }
        );
      }

      toast({ title: "Settings saved successfully" });
    } catch (error: any) {
      toast({ title: "Error saving settings", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Site Settings</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveSettings} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* General Settings */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Site Title</Label>
                <Input
                  value={settings.site_title}
                  onChange={(e) => handleChange("site_title", e.target.value)}
                  placeholder="Site title"
                />
              </div>
              <div className="space-y-2">
                <Label>Site Description</Label>
                <Textarea
                  value={settings.site_description}
                  onChange={(e) => handleChange("site_description", e.target.value)}
                  placeholder="Brief site description for SEO"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input
                  value={settings.google_analytics_id}
                  onChange={(e) => handleChange("google_analytics_id", e.target.value)}
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Contact Settings */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Phone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Contact Information</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    value={settings.contact_phone}
                    onChange={(e) => handleChange("contact_phone", e.target.value)}
                    placeholder="+91 ..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Phone</Label>
                  <Input
                    value={settings.emergency_phone}
                    onChange={(e) => handleChange("emergency_phone", e.target.value)}
                    placeholder="+91 ..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={settings.contact_email}
                    onChange={(e) => handleChange("contact_email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={settings.whatsapp_number}
                    onChange={(e) => handleChange("whatsapp_number", e.target.value)}
                    placeholder="+919909907475"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Social Media</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social_facebook}
                    onChange={(e) => handleChange("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social_instagram}
                    onChange={(e) => handleChange("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input
                    value={settings.social_linkedin}
                    onChange={(e) => handleChange("social_linkedin", e.target.value)}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>YouTube</Label>
                  <Input
                    value={settings.social_youtube}
                    onChange={(e) => handleChange("social_youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admin Actions */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Admin Actions</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Logged in as Admin</p>
                <p className="text-sm text-muted-foreground">{admin?.email || "Admin"}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
