import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { TeamMemberForm } from "@/components/admin/team/TeamMemberForm";
import { useToast } from "@/hooks/use-toast";
import { parseFocusAreasText, type TeamMemberAdminFormValues } from "@/lib/teamSchemas";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { UserCircle, Plus, Pencil, Trash2, ExternalLink, Users } from "lucide-react";

type TeamRow = Tables<"team_members">;

const emptyRow = {
  id: "",
  slug: "",
  full_name: "",
  title: null,
  credentials: null,
  bio: null,
  focus_areas: null,
  photo_url: null,
  display_order: 0,
  is_published: false,
  internal_notes: null,
  created_at: "",
  updated_at: "",
} as TeamRow;

function toInsertPayload(values: TeamMemberAdminFormValues): TablesInsert<"team_members"> {
  return {
    slug: values.slug.trim(),
    full_name: values.full_name.trim(),
    title: values.title?.trim() || null,
    credentials: values.credentials?.trim() || null,
    bio: values.bio?.trim() || null,
    focus_areas: parseFocusAreasText(values.focus_areas_text),
    photo_url: values.photo_url?.trim() || null,
    display_order: values.display_order,
    is_published: values.is_published,
    internal_notes: values.internal_notes?.trim() || null,
  };
}

export default function AdminTeam() {
  const { toast } = useToast();
  const [rows, setRows] = useState<TeamRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<TeamRow | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRows = useCallback(async () => {
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      toast({ title: "Failed to load team", description: error.message, variant: "destructive" });
      setRows([]);
    } else {
      setRows(data ?? []);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  const openNew = () => {
    setEditingItem({ ...emptyRow });
    setIsDialogOpen(true);
  };

  const openEdit = (row: TeamRow) => {
    setEditingItem({ ...row });
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (values: TeamMemberAdminFormValues) => {
    setIsSaving(true);
    const payload = toInsertPayload(values);

    try {
      if (editingItem?.id) {
        const { error } = await supabase
          .from("team_members")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase.from("team_members").insert(payload);
        if (error) {
          throw error;
        }
      }
      toast({ title: editingItem?.id ? "Member updated" : "Member created" });
      setIsDialogOpen(false);
      setEditingItem(null);
      await fetchRows();
    } catch (e) {
      const err = e as { message?: string };
      toast({
        title: "Save failed",
        description: err.message ?? "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) {
      return;
    }
    try {
      const { error } = await supabase.from("team_members").delete().eq("id", deleteId);
      if (error) {
        throw error;
      }
      toast({ title: "Member removed" });
      setDeleteId(null);
      await fetchRows();
    } catch (e) {
      const err = e as { message?: string };
      toast({ title: "Delete failed", description: err.message, variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <AdminGuard>
        <AdminLayout title="Team" subtitle="Clinical and leadership directory">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </AdminLayout>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <AdminLayout title="Team" subtitle="Manage profiles shown on the public /team page">
        <div className="max-w-4xl">
          <div className="flex justify-end mb-6">
            <Button type="button" onClick={openNew} className="gap-2">
              <Plus className="h-4 w-4" />
              Add team member
            </Button>
          </div>

          <ul className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className={`bg-card border rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 ${
                  !row.is_published ? "opacity-70" : ""
                }`}
              >
                <div className="flex gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <UserCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{row.full_name}</h3>
                    {row.title ? <p className="text-sm text-primary">{row.title}</p> : null}
                    <p className="text-xs text-muted-foreground font-mono mt-1">/{row.slug}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                      <span
                        className={
                          row.is_published
                            ? "px-2 py-0.5 rounded bg-success/10 text-success"
                            : "px-2 py-0.5 rounded bg-muted text-muted-foreground"
                        }
                      >
                        {row.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-muted-foreground">Order: {row.display_order}</span>
                      <a
                        href={`/team/${row.slug}`}
                        className="inline-flex items-center gap-1 text-secondary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Public page
                      </a>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0 self-end sm:self-start">
                  <Button type="button" variant="ghost" size="sm" onClick={() => openEdit(row)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    onClick={() => setDeleteId(row.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          {rows.length === 0 ? (
            <div className="text-center py-12 bg-card border rounded-lg">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No team members yet</h3>
              <p className="text-muted-foreground mb-4">Add doctors and staff for the public team page.</p>
              <Button type="button" onClick={openNew}>
                <Plus className="h-4 w-4 mr-2" />
                Add team member
              </Button>
            </div>
          ) : null}
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingItem(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem?.id ? "Edit team member" : "Add team member"}</DialogTitle>
            </DialogHeader>
            {editingItem ? (
              <TeamMemberForm
                key={editingItem.id || "new"}
                member={editingItem}
                isNew={!editingItem.id}
                isSaving={isSaving}
                onCancel={() => {
                  setIsDialogOpen(false);
                  setEditingItem(null);
                }}
                onSubmit={handleFormSubmit}
              />
            ) : null}
          </DialogContent>
        </Dialog>

        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete team member?</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the profile from the site. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </AdminGuard>
  );
}
