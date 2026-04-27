import { z } from "zod";

export const teamMemberSlugSchema = z
  .string()
  .min(1)
  .max(120)
  .transform((s) => s.trim().toLowerCase().replace(/\s+/g, "-"));

export const teamMemberCreateSchema = z.object({
  slug: z.string().min(1).max(120),
  full_name: z.string().min(1).max(200),
  title: z.string().max(200).optional().nullable(),
  credentials: z.string().max(500).optional().nullable(),
  bio: z.string().max(20000).optional().nullable(),
  focus_areas: z.array(z.string().max(120)).max(20).default([]),
  photo_url: z.string().url().max(2000).optional().nullable().or(z.literal("")),
  display_order: z.number().int().min(0).max(9999).optional(),
  is_published: z.boolean().optional(),
  internal_notes: z.string().max(5000).optional().nullable(),
});

export type TeamMemberCreateInput = z.infer<typeof teamMemberCreateSchema>;

/** Admin dialog form (focus areas as single text field). */
export const teamMemberAdminFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only"),
  full_name: z.string().min(1, "Name is required").max(200),
  title: z.string().max(200).optional().or(z.literal("")),
  credentials: z.string().max(500).optional().or(z.literal("")),
  bio: z.string().max(20000).optional().or(z.literal("")),
  focus_areas_text: z.string().optional().or(z.literal("")),
  photo_url: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal(""))
    .nullable()
    .refine((v) => !v || v.length === 0 || /^https?:\/\/.+/i.test(v), {
      message: "Enter a valid http(s) URL or leave empty",
    }),
  display_order: z.coerce.number().int().min(0).max(9999),
  is_published: z.boolean(),
  internal_notes: z.string().max(5000).optional().nullable().or(z.literal("")),
});

export type TeamMemberAdminFormValues = z.infer<typeof teamMemberAdminFormSchema>;

export function parseFocusAreasText(text: string | undefined | null): string[] {
  if (!text?.trim()) {
    return [];
  }
  return text
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
}

export function slugifyFromName(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}
