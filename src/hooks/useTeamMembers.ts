import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type TeamMemberRow = Tables<"team_members">;

/**
 * Public list: ordered for the Team page. Relies on database rules for visibility.
 */
export function useTeamMembers() {
  const [members, setMembers] = useState<TeamMemberRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching team members:", error);
      setLoadError(new Error(error.message));
      setMembers([]);
    } else {
      setMembers((data ?? []) as TeamMemberRow[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  return { members, isLoading, loadError, refetch: fetchMembers };
}

/**
 * Single member by slug (profile route).
 */
export function useTeamMemberBySlug(slug: string | undefined) {
  const [member, setMember] = useState<TeamMemberRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOne = useCallback(async () => {
    if (!slug) {
      setMember(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const { data, error } = await supabase
      .from("team_members")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error(error);
    }
    setMember(data as TeamMemberRow | null);
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    void fetchOne();
  }, [fetchOne]);

  return { member, isLoading, refetch: fetchOne };
}
