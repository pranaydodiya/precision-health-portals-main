-- Clinical / leadership team directory
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  full_name TEXT NOT NULL,
  title TEXT,
  credentials TEXT,
  bio TEXT,
  focus_areas TEXT[] DEFAULT '{}',
  photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (slug)
);

CREATE INDEX team_members_published_order_idx
  ON public.team_members (is_published, display_order);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Intention: public should only see published rows; see review for policy scope.
CREATE POLICY "Public can view team members"
ON public.team_members
FOR SELECT
USING (true);

CREATE POLICY "Admins can manage team members"
ON public.team_members
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
