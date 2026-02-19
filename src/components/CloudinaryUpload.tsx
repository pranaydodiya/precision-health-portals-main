import { useState } from "react";
import { Upload, X, Loader2, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export function CloudinaryUpload({ value, onChange, folder = "blog" }: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please select an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File size should be less than 10MB", variant: "destructive" });
      return;
    }

    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        // Upload to Cloudinary via edge function
        const { data, error } = await supabase.functions.invoke("cloudinary-upload", {
          body: {
            image: base64,
            folder: folder,
          },
        });

        if (error) throw error;

        if (data?.url) {
          setPreview(data.url);
          onChange(data.url);
          toast({ title: "Image uploaded successfully!" });
        } else {
          throw new Error("No URL returned from upload");
        }
      };
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setPreview(urlInput.trim());
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            id="cloudinary-upload"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-3" />
              <p className="text-muted-foreground">Uploading to Cloudinary...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">
                Drag and drop an image, or click to select
              </p>
              <div className="flex items-center justify-center gap-3">
                <label htmlFor="cloudinary-upload">
                  <Button variant="default" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </span>
                  </Button>
                </label>
                <Button
                  variant="outline"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Use URL
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {showUrlInput && !preview && (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button onClick={handleUrlSubmit}>Add</Button>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Supports: JPG, PNG, GIF, WebP (max 10MB) • Powered by Cloudinary
      </p>
    </div>
  );
}
