import { useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Navigation, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useClinicLocations } from "@/hooks/useClinicLocations";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { locations, isLoading: locationsLoading } = useClinicLocations();
  const { settings, isLoading: settingsLoading } = useSiteSettings();

  useEffect(() => {
    // Track page view
    supabase.from("page_analytics").insert({
      page_path: "/contact",
      page_title: "Contact - Dr. Nisarg Parmar",
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  }, []);

  const isLoading = locationsLoading || settingsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Contact & Locations
            </h1>
            <p className="text-lg text-muted-foreground">
              Reach out to us for appointments, inquiries, or emergency consultations. 
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-destructive py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-destructive-foreground">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div>
                <p className="font-bold text-lg">24/7 Emergency Neurosurgery</p>
                <p className="text-sm opacity-90">
                  Head injuries, spinal trauma, stroke - immediate care available
                </p>
              </div>
            </div>
            <a href={`tel:${settings.emergency_phone.replace(/\s/g, "")}`}>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-destructive-foreground text-destructive-foreground hover:bg-destructive-foreground hover:text-destructive whitespace-nowrap"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call: {settings.emergency_phone}
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading
            title="Our Locations"
            subtitle="Visit us at any of our clinic locations across Surat."
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : locations.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No locations available</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className={`bg-card border border-border rounded-lg p-6 ${
                    index === 0 ? "border-secondary border-2" : ""
                  }`}
                >
                  {index === 0 && (
                    <span className="inline-block bg-secondary/10 text-secondary text-xs font-medium px-2 py-1 rounded mb-3">
                      Primary Location
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-primary mb-4">
                    {location.name}
                  </h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-foreground">{location.address}</p>
                        {location.city && (
                          <p className="text-muted-foreground">{location.city}</p>
                        )}
                      </div>
                    </div>

                    {location.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <a 
                          href={`tel:${location.phone.replace(/\s/g, "")}`} 
                          className="text-secondary hover:underline"
                        >
                          {location.phone}
                        </a>
                      </div>
                    )}

                    {location.timing && (
                      <div className="flex items-center gap-3">
                        <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-foreground">{location.timing}</span>
                      </div>
                    )}
                  </div>

                  {location.map_url && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <a
                        href={location.map_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-secondary hover:underline"
                      >
                        <Navigation className="h-4 w-4" />
                        Get Directions
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <SectionHeading
            title="Find Us"
            subtitle="Conveniently located in central Surat for easy access."
          />

          <div className="aspect-[16/9] md:aspect-[21/9] bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive map coming soon</p>
              <a
                href="https://maps.google.com/?q=Surat+Gujarat+India"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-secondary hover:underline"
              >
                <Navigation className="h-4 w-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Summary */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Phone</h3>
              <a href={`tel:${settings.contact_phone.replace(/\s/g, "")}`} className="text-secondary hover:underline block">
                {settings.contact_phone}
              </a>
              <p className="text-xs text-muted-foreground mt-1">24/7 for emergencies</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Email</h3>
              <a href={`mailto:${settings.contact_email}`} className="text-secondary hover:underline block">
                {settings.contact_email}
              </a>
              <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Clinic Hours</h3>
              <p className="text-foreground">Mon - Sat: 10AM - 8PM</p>
              <p className="text-xs text-muted-foreground mt-1">Sunday: Closed</p>
            </div>

            <div className="text-center p-6">
              <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Location</h3>
              <p className="text-foreground">Surat, Gujarat</p>
              <p className="text-xs text-muted-foreground mt-1">{locations.length} clinic location{locations.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Ready to Book Your Appointment?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Schedule a consultation with Dr. Nisarg Parmar today. 
            We'll confirm your appointment within 2 hours.
          </p>
          <Link to="/appointments">
            <Button size="lg" variant="secondary">
              Book Appointment Now
            </Button>
          </Link>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Neurosurgeon in Surat, Gujarat
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Dr. Nisarg Parmar provides expert neurosurgical consultations and treatments 
            at multiple locations in Surat, Gujarat. Patients from Ahmedabad, Vadodara, 
            Rajkot, Bharuch, Vapi, and surrounding areas trust our practice for 
            comprehensive brain and spine care.
          </p>
          <p className="text-muted-foreground text-sm">
            Our clinics are conveniently located for easy access. Emergency neurosurgery 
            services are available 24/7. Contact us today for expert neurological care.
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Contact;
