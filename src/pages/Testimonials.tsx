import { useEffect, useState } from "react";
import { Star, Play, Quote } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useVideoTestimonials } from "@/hooks/useVideoTestimonials";
import { supabase } from "@/integrations/supabase/client";

// Static testimonials (written reviews)
const staticTestimonials = [
  {
    name: "Rajesh Patel",
    location: "Surat, Gujarat",
    rating: 5,
    text: "Dr. Nisarg performed my spine surgery with exceptional skill. I was back on my feet within weeks. His expertise and caring nature made all the difference. I highly recommend him to anyone facing spine issues.",
    date: "December 2024",
    condition: "Lumbar Disc Surgery",
  },
  {
    name: "Meena Shah",
    location: "Ahmedabad, Gujarat",
    rating: 5,
    text: "After my brain tumor diagnosis, I was scared and anxious. Dr. Parmar's calm demeanor and expert care gave me hope. The surgery was successful and I'm grateful forever. He explained everything clearly.",
    date: "November 2024",
    condition: "Brain Tumor Removal",
  },
  {
    name: "Amit Desai",
    location: "Vadodara, Gujarat",
    rating: 5,
    text: "Emergency surgery after my road accident. Dr. Nisarg's team responded quickly and saved my life. Professional, compassionate, and highly skilled. The entire hospital staff was supportive.",
    date: "October 2024",
    condition: "Neurotrauma",
  },
  {
    name: "Sunita Sharma",
    location: "Rajkot, Gujarat",
    rating: 5,
    text: "My 5-year-old son had hydrocephalus. Dr. Parmar treated him with such care and patience. The surgery was successful and my son is now thriving. We traveled from Rajkot and it was worth it.",
    date: "September 2024",
    condition: "Pediatric Hydrocephalus",
  },
  {
    name: "Prakash Mehta",
    location: "Surat, Gujarat",
    rating: 5,
    text: "Suffered from severe back pain for years. Dr. Nisarg's minimally invasive approach meant I was discharged in 2 days and back to work in 3 weeks. Incredible results with minimal scarring.",
    date: "August 2024",
    condition: "Minimally Invasive Spine Surgery",
  },
  {
    name: "Kavita Joshi",
    location: "Bharuch, Gujarat",
    rating: 5,
    text: "Brain aneurysm surgery is frightening, but Dr. Parmar's expertise gave us confidence. The surgery was successful and follow-up care has been excellent. My family is forever grateful.",
    date: "July 2024",
    condition: "Brain Aneurysm",
  },
  {
    name: "Harshad Trivedi",
    location: "Anand, Gujarat",
    rating: 5,
    text: "After being told by other doctors that my condition was too complex, Dr. Nisarg took on my case. His skill and determination resulted in a successful outcome. True expert.",
    date: "June 2024",
    condition: "Complex Spine Deformity",
  },
  {
    name: "Falguni Patel",
    location: "Vapi, Gujarat",
    rating: 5,
    text: "The entire experience from consultation to surgery to recovery was handled professionally. Dr. Parmar and his team provided clear communication throughout. Highly recommended.",
    date: "May 2024",
    condition: "Cervical Disc Surgery",
  },
];

const stats = [
  { number: "5000+", label: "Successful Surgeries" },
  { number: "4.9", label: "Average Rating" },
  { number: "98%", label: "Patient Satisfaction" },
  { number: "15+", label: "Years Experience" },
];

const Testimonials = () => {
  const { testimonials: videoTestimonials, isLoading } = useVideoTestimonials();
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    // Track page view
    supabase.from("page_analytics").insert({
      page_path: "/testimonials",
      page_title: "Testimonials - Dr. Nisarg Parmar",
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  }, []);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Patient Testimonials
            </h1>
            <p className="text-lg text-muted-foreground">
              Real experiences from patients who trusted Dr. Nisarg Parmar with 
              their neurological care.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-primary">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-3xl md:text-4xl font-bold text-primary-foreground">
                  {stat.number}
                </p>
                <p className="text-sm text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Quote */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-4xl">
          <div className="text-center">
            <Quote className="h-12 w-12 text-secondary/30 mx-auto mb-6" />
            <blockquote className="text-xl md:text-2xl text-foreground italic mb-6">
              "Dr. Parmar didn't just treat my condition — he gave me my life back. 
              His expertise, combined with genuine compassion, makes him the best 
              neurosurgeon in Gujarat."
            </blockquote>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-warning text-warning" />
              ))}
            </div>
            <p className="font-semibold text-foreground">Rajesh Patel</p>
            <p className="text-sm text-muted-foreground">Surat, Gujarat • Spine Surgery Patient</p>
          </div>
        </div>
      </section>

      {/* Video Testimonials - Dynamic from Database */}
      {videoTestimonials.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <SectionHeading
              title="Video Testimonials"
              subtitle="Watch patient stories and recovery journeys."
            />

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoTestimonials.map((video) => {
                const youtubeId = getYouTubeId(video.video_url);
                const isPlaying = playingVideo === video.id;
                
                return (
                  <div
                    key={video.id}
                    className="aspect-video bg-muted rounded-lg overflow-hidden relative"
                  >
                    {isPlaying && youtubeId ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                        title={video.patient_name}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div 
                        className="w-full h-full cursor-pointer group"
                        onClick={() => setPlayingVideo(video.id)}
                      >
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.patient_name}
                            className="w-full h-full object-cover"
                          />
                        ) : youtubeId ? (
                          <img
                            src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                            alt={video.patient_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/80" />
                        )}
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <div className="text-center">
                            <div className="w-16 h-16 rounded-full bg-secondary/90 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                              <Play className="h-8 w-8 text-secondary-foreground ml-1" />
                            </div>
                            <p className="text-white text-sm font-medium px-4">
                              {video.patient_name}
                            </p>
                            {video.condition && (
                              <p className="text-white/80 text-xs mt-1">
                                {video.condition}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* All Written Testimonials */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading
            title="What Our Patients Say"
            subtitle="Verified reviews from patients across Gujarat."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staticTestimonials.map((testimonial, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating ? "fill-warning text-warning" : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-secondary font-medium mb-3">
                    {testimonial.condition}
                  </span>
                  <p className="text-foreground text-sm leading-relaxed flex-grow mb-4">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{testimonial.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-secondary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-foreground mb-4">
            Ready to Experience Quality Care?
          </h2>
          <p className="text-secondary-foreground/80 mb-8 max-w-xl mx-auto">
            Join thousands of satisfied patients. Book your consultation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointments">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary">
                Book Appointment
              </Button>
            </Link>
            <a href="tel:+919909907475">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90"
              >
                Call: +91 99099 07475
              </Button>
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Testimonials;
