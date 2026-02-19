import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Video,
  Save,
  X,
  Loader2,
  Play,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface VideoTestimonial {
  id: string;
  patient_name: string;
  condition: string | null;
  video_url: string;
  thumbnail_url: string | null;
  is_published: boolean;
  display_order: number;
}

const emptyTestimonial: Omit<VideoTestimonial, "id"> = {
  patient_name: "",
  condition: "",
  video_url: "",
  thumbnail_url: "",
  is_published: false,
  display_order: 0,
};

export default function AdminTestimonials() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [testimonials, setTestimonials] = useState<VideoTestimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<VideoTestimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchTestimonials();
    }
  }, [admin]);

  const fetchTestimonials = async () => {
    const { data, error } = await supabase
      .from("video_testimonials")
      .select("*")
      .order("display_order");

    if (!error && data) {
      setTestimonials(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editingItem?.patient_name || !editingItem?.video_url) {
      toast({ title: "Patient name and video URL are required", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("video_testimonials")
          .update(editingItem)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("video_testimonials")
          .insert({ ...editingItem, id: undefined });
        if (error) throw error;
      }

      toast({ title: "Testimonial saved successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchTestimonials();
    } catch (error: any) {
      toast({ title: "Error saving testimonial", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("video_testimonials")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;

      toast({ title: "Testimonial deleted" });
      setDeleteId(null);
      fetchTestimonials();
    } catch (error: any) {
      toast({ title: "Error deleting testimonial", description: error.message, variant: "destructive" });
    }
  };

  const openNewDialog = () => {
    setEditingItem({ ...emptyTestimonial, id: "" } as VideoTestimonial);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: VideoTestimonial) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
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
            <h1 className="text-lg font-semibold text-foreground">Video Testimonials</h1>
          </div>
          <Button onClick={openNewDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Testimonial
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className={`bg-card border rounded-lg overflow-hidden ${!item.is_published && "opacity-60"}`}
            >
              <div className="aspect-video bg-muted relative flex items-center justify-center">
                {item.thumbnail_url ? (
                  <img
                    src={item.thumbnail_url}
                    alt={item.patient_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Video className="h-12 w-12 text-muted-foreground" />
                )}
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Play className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{item.patient_name}</h3>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {item.condition && (
                  <p className="text-sm text-muted-foreground mb-2">{item.condition}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${item.is_published ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                    {item.is_published ? "Published" : "Draft"}
                  </span>
                  <span className="text-xs text-muted-foreground">Order: {item.display_order}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <div className="text-center py-12">
            <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No video testimonials yet</h3>
            <p className="text-muted-foreground mb-4">Add your first video testimonial</p>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingItem?.id ? "Edit Testimonial" : "Add Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Patient Name *</Label>
              <Input
                value={editingItem?.patient_name || ""}
                onChange={(e) =>
                  setEditingItem((prev) => prev && { ...prev, patient_name: e.target.value })
                }
                placeholder="Patient name"
              />
            </div>
            <div className="space-y-2">
              <Label>Condition/Treatment</Label>
              <Input
                value={editingItem?.condition || ""}
                onChange={(e) =>
                  setEditingItem((prev) => prev && { ...prev, condition: e.target.value })
                }
                placeholder="e.g., Brain Tumor Recovery"
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL *</Label>
              <Input
                value={editingItem?.video_url || ""}
                onChange={(e) =>
                  setEditingItem((prev) => prev && { ...prev, video_url: e.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Thumbnail URL</Label>
              <Input
                value={editingItem?.thumbnail_url || ""}
                onChange={(e) =>
                  setEditingItem((prev) => prev && { ...prev, thumbnail_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editingItem?.display_order || 0}
                  onChange={(e) =>
                    setEditingItem((prev) =>
                      prev && { ...prev, display_order: parseInt(e.target.value) || 0 }
                    )
                  }
                />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch
                  checked={editingItem?.is_published ?? false}
                  onCheckedChange={(checked) =>
                    setEditingItem((prev) => prev && { ...prev, is_published: checked })
                  }
                />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this video testimonial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
