import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  teamMemberAdminFormSchema,
  type TeamMemberAdminFormValues,
  slugifyFromName,
} from "@/lib/teamSchemas";
import type { Tables } from "@/integrations/supabase/types";
import { Save, X, Loader2 } from "lucide-react";

type TeamRow = Tables<"team_members">;

const emptyValues: TeamMemberAdminFormValues = {
  slug: "",
  full_name: "",
  title: "",
  credentials: "",
  bio: "",
  focus_areas_text: "",
  photo_url: "",
  display_order: 0,
  is_published: false,
  internal_notes: "",
};

function toFormValues(row: TeamRow | null): TeamMemberAdminFormValues {
  if (!row) {
    return { ...emptyValues };
  }
  return {
    slug: row.slug,
    full_name: row.full_name,
    title: row.title ?? "",
    credentials: row.credentials ?? "",
    bio: row.bio ?? "",
    focus_areas_text: (row.focus_areas ?? []).join(", "),
    photo_url: row.photo_url ?? "",
    display_order: row.display_order ?? 0,
    is_published: row.is_published ?? false,
    internal_notes: row.internal_notes ?? "",
  };
}

export interface TeamMemberFormProps {
  member: TeamRow | null;
  isNew: boolean;
  isSaving: boolean;
  onSubmit: (values: TeamMemberAdminFormValues) => void | Promise<void>;
  onCancel: () => void;
}

export function TeamMemberForm({
  member,
  isNew,
  isSaving,
  onSubmit,
  onCancel,
}: TeamMemberFormProps) {
  const form = useForm<TeamMemberAdminFormValues>({
    resolver: zodResolver(teamMemberAdminFormSchema),
    defaultValues: toFormValues(member),
  });

  useEffect(() => {
    form.reset(toFormValues(member));
  }, [member, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((v) => onSubmit(v))} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Dr. Jane Doe"
                  {...field}
                  onChange={(e) => {
                    const name = e.target.value;
                    field.onChange(name);
                    if (isNew && !form.getValues("slug")) {
                      form.setValue("slug", slugifyFromName(name));
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL slug *</FormLabel>
              <FormControl>
                <Input placeholder="jane-doe" {...field} />
              </FormControl>
              <p className="text-xs text-muted-foreground">Public URL: /team/{field.value || "…"}</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title / role</FormLabel>
              <FormControl>
                <Input placeholder="Consultant neurosurgeon" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="credentials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credentials</FormLabel>
              <FormControl>
                <Input placeholder="MBBS, MS, MCh" {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Biography</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="HTML allowed for rich text (use with care)"
                  className="min-h-[120px] font-mono text-sm"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="focus_areas_text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus areas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="One per line, or comma-separated"
                  rows={3}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="photo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo</FormLabel>
              <FormControl>
                <CloudinaryUpload
                  folder="team"
                  value={field.value || ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display order</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={9999} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_published"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 sm:mt-6">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Published</FormLabel>
                  <p className="text-xs text-muted-foreground">Show on the public /team page</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="internal_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Internal notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Not shown on the public site"
                  rows={2}
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">For staff use only; keep sensitive info out of public bio.</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
