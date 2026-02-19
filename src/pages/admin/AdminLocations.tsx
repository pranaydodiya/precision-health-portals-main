import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Save,
  X,
  Loader2,
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

interface Location {
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

const emptyLocation: Omit<Location, "id"> = {
  name: "",
  address: "",
  city: "",
  phone: "",
  timing: "",
  map_url: "",
  is_active: true,
  display_order: 0,
};

export default function AdminLocations() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
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
      fetchLocations();
    }
  }, [admin]);

  const fetchLocations = async () => {
    const { data, error } = await supabase
      .from("clinic_locations")
      .select("*")
      .order("display_order");

    if (!error && data) {
      setLocations(data);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (!editingLocation?.name || !editingLocation?.address) {
      toast({ title: "Name and address are required", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      if (editingLocation.id) {
        const { error } = await supabase
          .from("clinic_locations")
          .update(editingLocation)
          .eq("id", editingLocation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("clinic_locations")
          .insert({ ...editingLocation, id: undefined });
        if (error) throw error;
      }

      toast({ title: "Location saved successfully" });
      setIsDialogOpen(false);
      setEditingLocation(null);
      fetchLocations();
    } catch (error: any) {
      toast({ title: "Error saving location", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("clinic_locations")
        .delete()
        .eq("id", deleteId);
      if (error) throw error;

      toast({ title: "Location deleted" });
      setDeleteId(null);
      fetchLocations();
    } catch (error: any) {
      toast({ title: "Error deleting location", description: error.message, variant: "destructive" });
    }
  };

  const openNewDialog = () => {
    setEditingLocation({ ...emptyLocation, id: "" } as Location);
    setIsDialogOpen(true);
  };

  const openEditDialog = (location: Location) => {
    setEditingLocation({ ...location });
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
            <h1 className="text-lg font-semibold text-foreground">Clinic Locations</h1>
          </div>
          <Button onClick={openNewDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Location
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <div
              key={location.id}
              className={`bg-card border rounded-lg p-5 ${!location.is_active && "opacity-60"}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">{location.name}</h3>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(location)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteId(location.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{location.address}</p>
              {location.city && (
                <p className="text-sm text-muted-foreground mb-2">{location.city}</p>
              )}
              {location.phone && (
                <p className="text-sm text-foreground mb-2">{location.phone}</p>
              )}
              {location.timing && (
                <p className="text-xs text-muted-foreground">{location.timing}</p>
              )}
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded ${location.is_active ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  {location.is_active ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-muted-foreground">Order: {location.display_order}</span>
              </div>
            </div>
          ))}
        </div>

        {locations.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No locations yet</h3>
            <p className="text-muted-foreground mb-4">Add your first clinic location</p>
            <Button onClick={openNewDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLocation?.id ? "Edit Location" : "Add Location"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={editingLocation?.name || ""}
                onChange={(e) =>
                  setEditingLocation((prev) => prev && { ...prev, name: e.target.value })
                }
                placeholder="Hospital/Clinic name"
              />
            </div>
            <div className="space-y-2">
              <Label>Address *</Label>
              <Textarea
                value={editingLocation?.address || ""}
                onChange={(e) =>
                  setEditingLocation((prev) => prev && { ...prev, address: e.target.value })
                }
                placeholder="Full address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={editingLocation?.city || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => prev && { ...prev, city: e.target.value })
                  }
                  placeholder="City, State"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={editingLocation?.phone || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => prev && { ...prev, phone: e.target.value })
                  }
                  placeholder="+91 ..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Timing</Label>
              <Input
                value={editingLocation?.timing || ""}
                onChange={(e) =>
                  setEditingLocation((prev) => prev && { ...prev, timing: e.target.value })
                }
                placeholder="Mon-Fri: 10am-6pm"
              />
            </div>
            <div className="space-y-2">
              <Label>Map URL</Label>
              <Input
                value={editingLocation?.map_url || ""}
                onChange={(e) =>
                  setEditingLocation((prev) => prev && { ...prev, map_url: e.target.value })
                }
                placeholder="https://maps.google.com/..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={editingLocation?.display_order || 0}
                  onChange={(e) =>
                    setEditingLocation((prev) =>
                      prev && { ...prev, display_order: parseInt(e.target.value) || 0 }
                    )
                  }
                />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch
                  checked={editingLocation?.is_active ?? true}
                  onCheckedChange={(checked) =>
                    setEditingLocation((prev) => prev && { ...prev, is_active: checked })
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
            <AlertDialogTitle>Delete Location?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this clinic location.
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
