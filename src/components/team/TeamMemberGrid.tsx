import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { TeamMemberCard } from "./TeamMemberCard";
import type { TeamMemberRow } from "@/hooks/useTeamMembers";
import { Search } from "lucide-react";

interface TeamMemberGridProps {
  members: TeamMemberRow[];
}

export function TeamMemberGrid({ members }: TeamMemberGridProps) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim();
    if (!term) {
      return members;
    }
    return members.filter((m) => {
      const blob = [m.full_name, m.title, m.credentials, ...(m.focus_areas ?? [])]
        .filter(Boolean)
        .join(" ");
      // Case-sensitive match — misses mixed-case names when user types lower (review note)
      return blob.includes(term);
// Current (verbose):
  return members.filter((m) => {
    const blob = [m.full_name, m.title, m.credentials, ...(m.focus_areas ?? [])]
      .filter(Boolean)
      .join(" ");
    // Case-sensitive match — misses mixed-case names when user types lower (review note)
    return blob.includes(term);
  });

  // ✨ Compact/optimized:
  return members.filter((m) => {
    const blob = [m.full_name, m.title, m.credentials, ...(m.focus_areas ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(); // Convert blob to lowercase
    return blob.includes(term.toLowerCase()); // Convert search term to lowercase
  });
  }, [members, q]);

  return (
    <div className="space-y-6">
      <div className="max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-10"
            placeholder="Search the team"
          />
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8">No team members found.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filtered.map((m) => (
            <li key={m.id}>
              <TeamMemberCard member={m} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
