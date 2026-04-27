import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight } from "lucide-react";
import type { TeamMemberRow } from "@/hooks/useTeamMembers";

interface TeamMemberCardProps {
  member: TeamMemberRow;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const initials = member.full_name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden border-border/80 transition-shadow hover:shadow-md h-full">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-5 sm:p-6">
          <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl border border-border">
            {member.photo_url ? (
              <AvatarImage src={member.photo_url} alt="" />
            ) : null}
            <AvatarFallback className="rounded-xl text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 space-y-1">
            <h3 className="text-lg font-semibold text-foreground leading-tight">{member.full_name}</h3>
            {member.title ? (
              <p className="text-sm text-primary font-medium">{member.title}</p>
            ) : null}
            {member.credentials ? (
              <p className="text-xs text-muted-foreground line-clamp-2">{member.credentials}</p>
            ) : null}
            {member.focus_areas && member.focus_areas.length > 0 ? (
              <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                {member.focus_areas.join(" · ")}
              </p>
            ) : null}
            <Link
              to={`/team/${member.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary mt-3 hover:underline"
            >
              View profile
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
