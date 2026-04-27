import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamMemberGrid } from "@/components/team/TeamMemberGrid";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export default function Team() {
  const { members, isLoading, loadError } = useTeamMembers();

  useEffect(() => {
    void supabase.from("page_analytics").insert({
      page_path: "/team",
      page_title: "Team — Dr. Nisarg Parmar",
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Clinical team | Dr. Nisarg Parmar</title>
        <meta
          name="description"
          content="Neurosurgery and clinical leadership team — Dr. Nisarg Parmar, Surat."
        />
      </Helmet>
      <Header />
      <main className="flex-1 pt-[104px]">
        <section className="py-12 md:py-16">
          <div className="container max-w-5xl">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <SectionHeading
                title="People behind your care"
                subtitle="Our team — multidisciplinary support focused on brain and spine conditions."
              />
            </div>
            {isLoading ? null : loadError ? (
              <p className="text-center text-destructive text-sm">
                Something went wrong. Please try again later.
              </p>
            ) : (
              <TeamMemberGrid members={members} />
            )}
            <p className="text-center text-sm text-muted-foreground mt-10">
              Looking for a consultation?{" "}
              <Link to="/#appointment" className="text-secondary font-medium hover:underline">
                Book an appointment
              </Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
