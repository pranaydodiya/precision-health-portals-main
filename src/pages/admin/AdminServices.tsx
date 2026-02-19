import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import {
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  Save,
  X,
  Loader2,
  GripVertical,
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

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string | null;
  icon: string | null;
  is_active: boolean;
  display_order: number;
}

const emptyService: Omit<Service, "id"> = {
  title: "",
  slug: "",
  description: "",
  content: "",
  icon: "",
  is_active: true,
  display_order: 0,
};

const iconOptions = [
  "Brain", "Activity", "HeartPulse", "Baby", "Droplets", "Minimize2",
  "Stethoscope", "Syringe", "Bone", "Scan", "Cross", "Pill"
];

export default function AdminServices() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");

    if (!error && data) {
      setServices(data);
    }
    setIsLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setEditingItem((prev) =>
      prev && {
        ...prev,
        title,
        slug: prev.id ? prev.slug : generateSlug(title),
      }
    );
  };

  const handleSave = async () => {
    if (!editingItem?.title || !editingItem?.slug) {
      toast({ title: "Title is required", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      if (editingItem.id) {
        const { error } = await supabase
          .from("services")
          .update({
            title: editingItem.title,
            slug: editingItem.slug,
            description: editingItem.description,
            content: editingItem.content,
            icon: editingItem.icon,
            is_active: editingItem.is_active,
            display_order: editingItem.display_order,
          })
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert({
          title: editingItem.title,
          slug: editingItem.slug,
          description: editingItem.description,
          content: editingItem.content,
          icon: editingItem.icon,
          is_active: editingItem.is_active,
          display_order: editingItem.display_order,
        });
        if (error) throw error;
      }

      toast({ title: "Service saved successfully" });
      setIsDialogOpen(false);
      setEditingItem(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error saving service",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase.from("services").delete().eq("id", deleteId);
      if (error) throw error;

      toast({ title: "Service deleted" });
      setDeleteId(null);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openNewDialog = () => {
    setEditingItem({ ...emptyService, id: "" } as Service);
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: Service) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminLayout title="Services">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout title="Services" subtitle="Manage your medical services">
        <div className="max-w-4xl">
          <div className="flex justify-end mb-6">
            <Button onClick={openNewDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Service
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-card border rounded-lg p-5 flex items-start justify-between gap-4 ${
                  !service.is_active && "opacity-60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {service.description || "No description"}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>/{service.slug}</span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          service.is_active
                            ? "bg-success/10 text-success"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {service.is_active ? "Active" : "Inactive"}
                      </span>
                      <span>Order: {service.display_order}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteId(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-12 bg-card border rounded-lg">
              <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No services yet</h3>
              <p className="text-muted-foreground mb-4">Add your first medical service</p>
              <Button onClick={openNewDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </div>
          )}
        </div>

        {/* Edit/Add Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem?.id ? "Edit Service" : "Add Service"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  value={editingItem?.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Brain Tumor Surgery"
                />
              </div>
              <div className="space-y-2">
                <Label>URL Slug</Label>
                <Input
                  value={editingItem?.slug || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, slug: e.target.value })
                  }
                  placeholder="brain-tumor-surgery"
                />
              </div>
              <div className="space-y-2">
                <Label>Short Description</Label>
                <Textarea
                  value={editingItem?.description || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, description: e.target.value })
                  }
                  placeholder="Brief description for cards"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Full Content (Markdown)</Label>
                <Textarea
                  value={editingItem?.content || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, content: e.target.value })
                  }
                  placeholder="Detailed service description..."
                  rows={6}
                />
              </div>
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input
                  value={editingItem?.icon || ""}
                  onChange={(e) =>
                    setEditingItem((prev) => prev && { ...prev, icon: e.target.value })
                  }
                  placeholder="e.g., Brain, Activity, HeartPulse"
                />
                <p className="text-xs text-muted-foreground">
                  Available: {iconOptions.join(", ")}
                </p>
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
                    checked={editingItem?.is_active ?? true}
                    onCheckedChange={(checked) =>
                      setEditingItem((prev) => prev && { ...prev, is_active: checked })
                    }
                  />
                  <Label>Active</Label>
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
              <AlertDialogTitle>Delete Service?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this service.
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
      </AdminLayout>
    </AdminGuard>
  );
}
