import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTeamMemberBySlug } from "@/hooks/useTeamMembers";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function TeamMemberProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { member, isLoading } = useTeamMemberBySlug(slug);

  useEffect(() => {
    if (slug) {
      void supabase.from("page_analytics").insert({
        page_path: `/team/${slug}`,
        page_title: member ? `${member.full_name} | Team` : "Team member",
        referrer: document.referrer,
        user_agent: navigator.userAgent,
      });
    }
  }, [slug, member]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[104px] py-16 container max-w-3xl" />
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-[104px] py-16 container max-w-3xl">
          <p className="text-muted-foreground">Not found.</p>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  const initials = member.full_name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>
          {member.full_name} | Team — Dr. Nisarg Parmar
        </title>
        <meta name="description" content={member.bio ? member.bio.slice(0, 160) : member.title ?? ""} />
      </Helmet>
      <Header />
      <main className="flex-1 pt-[104px] py-10 md:py-14">
        <div className="container max-w-3xl">
          <Button variant="ghost" asChild className="mb-8 -ml-2 gap-2 text-muted-foreground">
            <Link to="/team">
              <ArrowLeft className="h-4 w-4" />
              Back to team
            </Link>
          </Button>
          <div className="flex flex-col sm:flex-row gap-8 sm:items-start">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 rounded-2xl border-2 border-border shrink-0">
              {member.photo_url ? <AvatarImage src={member.photo_url} alt={member.full_name} /> : null}
              <AvatarFallback className="rounded-2xl text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{member.full_name}</h1>
              {member.title ? <p className="text-lg text-primary font-medium">{member.title}</p> : null}
              {member.credentials ? (
                <p className="text-sm text-muted-foreground">{member.credentials}</p>
              ) : null}
            </div>
          </div>
          {member.focus_areas && member.focus_areas.length > 0 ? (
            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Focus areas
              </h2>
              <ul className="flex flex-wrap gap-2">
                {member.focus_areas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full bg-muted px-3 py-1 text-sm text-foreground"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {member.bio ? (
            <div
              className="mt-10 prose prose-neutral dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: member.bio }}
            />
          ) : null}
          {member.internal_notes ? (
            <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/40 p-4 text-sm text-muted-foreground">
              <p className="text-xs font-medium text-foreground/80 mb-1">Reference</p>
              <p className="whitespace-pre-wrap">{member.internal_notes}</p>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
