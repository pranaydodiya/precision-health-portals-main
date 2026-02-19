import { useState, useCallback, memo } from "react";
import { Brain, Activity, HeartPulse, Baby, Droplets, Minimize2, Phone, Calendar, CheckCircle, Star, GraduationCap, Building, Award, Clock, MapPin, Mail, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { AIChatbot } from "@/components/AIChatbot";
import { AccessibilityMenu } from "@/components/AccessibilityMenu";
import { TrustIndicators } from "@/components/TrustIndicators";
import { SpecialtyCard } from "@/components/SpecialtyCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { VideoTestimonialCard } from "@/components/VideoTestimonialCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import drPhoto from "@/assets/dr-nisarg-parmar.png";
const specialties = [{
  icon: Brain,
  title: "Brain Tumor Surgery",
  description: "Advanced surgical treatment for brain tumors with precision and care."
}, {
  icon: Activity,
  title: "Spine Surgery",
  description: "Comprehensive spine surgery solutions for disc, deformity, and trauma cases."
}, {
  icon: HeartPulse,
  title: "Neurotrauma Care",
  description: "Emergency neurosurgical care for head and spine injuries."
}, {
  icon: Baby,
  title: "Pediatric Neurosurgery",
  description: "Specialized care for children with neurological conditions."
}, {
  icon: Droplets,
  title: "Vascular Neurosurgery",
  description: "Treatment of aneurysms, AVMs, and other vascular brain conditions."
}, {
  icon: Minimize2,
  title: "Minimally Invasive Surgery",
  description: "Advanced techniques for faster recovery and minimal scarring."
}];
const testimonials = [{
  name: "Rajesh Patel",
  location: "Surat, Gujarat",
  rating: 5,
  text: "Dr. Nisarg performed my spine surgery with exceptional skill. I was back on my feet within weeks. His expertise and caring nature made all the difference.",
  date: "December 2024"
}, {
  name: "Meena Shah",
  location: "Ahmedabad, Gujarat",
  rating: 5,
  text: "After my brain tumor diagnosis, I was scared. Dr. Parmar's calm demeanor and expert care gave me hope. The surgery was successful and I'm grateful forever.",
  date: "November 2024"
}, {
  name: "Amit Desai",
  location: "Vadodara, Gujarat",
  rating: 5,
  text: "Emergency surgery after my accident. Dr. Nisarg's team responded quickly and saved my life. Professional, compassionate, and highly skilled.",
  date: "October 2024"
}];
const videoTestimonials = [{
  name: "Suresh Kumar",
  condition: "Brain Tumor Recovery",
  thumbnailText: "3:45"
}, {
  name: "Meera Joshi",
  condition: "Spine Surgery Success",
  thumbnailText: "2:30"
}, {
  name: "Vikram Singh",
  condition: "Neurotrauma Recovery",
  thumbnailText: "4:15"
}];
const reasons = ["NIMHANS Trained Neurosurgeon", "15+ Years of Experience", "5000+ Successful Surgeries", "24/7 Emergency Availability", "Advanced Surgical Techniques", "Patient-Centered Care"];
const education = [{
  degree: "MCh Neurosurgery",
  institution: "NIMHANS",
  location: "Bangalore, India",
  highlight: true
}, {
  degree: "MS General Surgery",
  institution: "Medical College",
  location: "Gujarat, India",
  highlight: false
}, {
  degree: "MBBS",
  institution: "Medical College",
  location: "Gujarat, India",
  highlight: false
}];
const affiliations = ["SIDS Hospital, Surat", "Unity Hospital, Surat", "Pinnacle Brain and Spine Center, Surat", "Apple Hospital", "Mahavir Hospital", "Venus Hospital"];
const timeSlots = ["11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "01:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "04:00 PM", "04:30 PM", "05:00 PM", "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM"];
const locations = [{
  name: "SIDS Hospital",
  address: "SIDS Hospital & Research Centre, off Ring Road, near Shell Petrol Pump, Sosyo Circle, Lane",
  city: "Surat, Gujarat 395002",
  phone: "+91 99099 07475",
  timings: ["Mon to Thu - 1pm to 3pm", "Mon to Fri - 6pm to 8pm", "Sat - 2pm to 4pm"],
  isPrimary: true,
  mapLink: "https://maps.google.com/?q=SIDS+Hospital+Surat",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.5!2d72.82!3d21.19!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSIDS+Hospital!5e0!3m2!1sen!2sin!4v1700000000000"
}, {
  name: "Unity Hospital",
  address: "Aai Mata Rd, opp. Raghuveer Business Empire, Bhagyoday Industrial Estate, Parvat Patiya",
  city: "Surat, Gujarat 395010",
  phone: "+91 261 260 7000",
  timings: ["Mon to Thu - 11am to 1pm"],
  isPrimary: false,
  mapLink: "https://maps.google.com/?q=Unity+Hospital+Surat",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3720.0!2d72.85!3d21.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sUnity+Hospital!5e0!3m2!1sen!2sin!4v1700000000000"
}, {
  name: "Pinnacle Brain and Spine Center",
  address: "Mangaldeep Complex, 102, Varachha Main Rd, in front of Ramnagar Gate, Anjana Society",
  city: "Surat, Gujarat 395006",
  phone: "+91 26143 75934",
  timings: ["Mon to Thu - 4pm to 6pm", "Sat - 2pm to 4pm"],
  isPrimary: false,
  mapLink: "https://maps.google.com/?q=Pinnacle+Brain+Spine+Center+Surat",
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.8!2d72.87!3d21.18!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sPinnacle+Brain+Spine+Center!5e0!3m2!1sen!2sin!4v1700000000000"
}];
const otherHospitals = ["Apple Hospital", "Mahavir Hospital", "Venus Hospital"];
const Index = () => {
  const {
    toast
  } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    condition: "",
    message: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      toast({
        title: "Please fill required fields",
        description: "Name, phone number, and preferred date are required.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitted(true);
    toast({
      title: "Appointment Request Received",
      description: "We will contact you shortly to confirm your appointment."
    });
  };
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section id="hero" className="pt-28 pb-16 md:pt-36 md:pb-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            {/* Alumni line first */}
            <p className="text-secondary font-medium mb-6 text-sm md:text-base">
              Alumni of NIMHANS • India's Top Neurosurgical Institution
            </p>
            
            {/* Dr Photo */}
            <div className="mb-6">
              <img 
                src={drPhoto} 
                alt="Dr. Nisarg Parmar - Neurosurgeon" 
                className="w-44 h-56 md:w-52 md:h-64 object-cover object-top mx-auto rounded-lg shadow-lg" 
              />
            </div>
            
            {/* Name and description */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
              Dr. Nisarg Parmar
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">
              Neurosurgeon | Brain & Spine Specialist
            </p>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Welcome to the forefront of neurological care excellence. Providing expert care 
              in Gujarat with over 15 years of experience in complex brain and spine surgeries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 gap-2" onClick={() => scrollToSection("appointment")}>
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Button>
              <a href="tel:+919909907475">
                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                  <Phone className="h-5 w-5" />
                  Emergency: +91 99099 07475
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">

            {/* Bio */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-warning fill-warning" />
                <span className="text-sm font-medium text-muted-foreground">
                  NIMHANS Trained Expert
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                About Dr. Nisarg Parmar
              </h2>
              <p className="text-secondary font-medium mb-4">
                MBBS, MS (General Surgery), MCh (Neurosurgery)
              </p>

              <div className="prose prose-slate max-w-none">
                <p className="text-muted-foreground mb-4">
                  Dr. Nisarg Parmar is a highly skilled neurosurgeon with extensive training 
                  from the prestigious National Institute of Mental Health and Neurosciences 
                  (NIMHANS), Bangalore — India's premier center for neurological sciences.
                </p>
                <p className="text-muted-foreground mb-4">
                  With over 15 years of experience and more than 5,000 successful surgeries, 
                  Dr. Parmar has established himself as one of Gujarat's most trusted 
                  neurosurgeons.
                </p>
              </div>

              {/* Education */}
              <div className="mt-8 space-y-3">
                {education.map((edu, index) => <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${edu.highlight ? "bg-secondary/10 border border-secondary/20" : "bg-muted"}`}>
                    <GraduationCap className={`h-5 w-5 ${edu.highlight ? "text-secondary" : "text-muted-foreground"}`} />
                    <div>
                      <p className="font-medium text-foreground text-sm">{edu.degree}</p>
                      <p className="text-xs text-muted-foreground">{edu.institution}, {edu.location}</p>
                    </div>
                  </div>)}
              </div>

              {/* Hospital Affiliations */}
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  Hospital Affiliations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {affiliations.map((affiliation, index) => <span key={index} className="bg-muted px-3 py-1 rounded-full text-sm text-foreground">
                      {affiliation}
                    </span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeading title="Why Choose Dr. Nisarg Parmar?" subtitle="Trusted by thousands of patients across Gujarat for expert neurological care." centered={false} />
              
              <ul className="space-y-3 mb-8">
                {reasons.map((reason, index) => <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                    <span className="text-foreground">{reason}</span>
                  </li>)}
              </ul>
            </div>

            <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-10">
              <Award className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-4">
                Philosophy of Care
              </h3>
              <blockquote className="text-primary-foreground/90 italic">
                "Every patient deserves not just the best medical treatment, but also 
                compassion, clear communication, and hope. I believe in treating the 
                whole person, not just the condition."
              </blockquote>
              <p className="mt-4 font-medium">
                — Dr. Nisarg Parmar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading title="Our Specialties" subtitle="Comprehensive neurosurgical services for brain and spine conditions." />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialties.map((specialty, index) => <SpecialtyCard key={index} icon={specialty.icon} title={specialty.title} description={specialty.description} />)}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <SectionHeading title="Patient Testimonials" subtitle="Real experiences from patients who trusted us with their care." />
          
          {/* Google Reviews Widget */}
          <div>
            <div className="elfsight-app-a7502a87-5928-49dc-bc79-36cf114fbdc4" data-elfsight-app-lazy></div>
          </div>

          {/* Video Testimonials - Horizontal Scroll */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-foreground text-center mb-6">
              Video Testimonials
            </h3>
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {videoTestimonials.map((video, index) => (
                  <div 
                    key={index} 
                    className="min-w-[280px] md:min-w-[320px] snap-start animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <VideoTestimonialCard 
                      name={video.name} 
                      condition={video.condition} 
                      thumbnailText={video.thumbnailText} 
                    />
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-2">
                ← Swipe to see more videos →
              </p>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Patient video testimonials shared with consent. More coming soon.
            </p>
          </div>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="appointment" className="py-16 md:py-24 bg-background">
        <div className="container">
          <SectionHeading title="Book an Appointment" subtitle="Schedule a consultation with Dr. Nisarg Parmar. We'll confirm within 2 hours." />

          {/* Emergency Banner */}
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg py-4 px-6 mb-8 flex items-center justify-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Emergency?</strong> Call immediately:{" "}
              <a href="tel:+919909907475" className="text-destructive font-semibold hover:underline">
                +91 99099 07475
              </a>
            </p>
          </div>

          {isSubmitted ? <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4">
                Appointment Request Received!
              </h3>
              <p className="text-muted-foreground mb-8">
                Thank you, {formData.name}. We have received your appointment request 
                for {formData.date}. Our team will contact you at {formData.phone} 
                within 2 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)} variant="outline">
                Book Another Appointment
              </Button>
            </div> : <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2">
                <div className="medical-card">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={handleChange} required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" name="email" type="email" placeholder="your@email.com" value={formData.email} onChange={handleChange} />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date *</Label>
                        <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time">Preferred Time</Label>
                        <select id="time" name="time" value={formData.time} onChange={handleChange} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                          <option value="">Select a time slot</option>
                          {timeSlots.map(slot => <option key={slot} value={slot}>
                              {slot}
                            </option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition / Reason for Visit</Label>
                      <Input id="condition" name="condition" placeholder="e.g., Back pain, Brain scan follow-up" value={formData.condition} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea id="message" name="message" placeholder="Any additional details..." rows={3} value={formData.message} onChange={handleChange} />
                    </div>

                    <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                      Request Appointment
                    </Button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="medical-card">
                  <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Clinic Hours
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monday - Friday</span>
                      <span className="text-foreground font-medium">10AM - 6PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saturday</span>
                      <span className="text-foreground font-medium">10AM - 2PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sunday</span>
                      <span className="text-foreground font-medium">Closed</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <SectionHeading title="Contact & Locations" subtitle="Visit Dr. Nisarg Parmar at any of these locations in Surat." />
          
          {/* Main Clinic Locations */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {locations.map((location, index) => <div key={index} className={`medical-card h-full ${location.isPrimary ? "border-secondary border-2" : ""}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full">
                    {index + 1}
                  </span>
                  {location.isPrimary && <span className="inline-block bg-secondary/10 text-secondary text-xs font-medium px-2 py-1 rounded">
                      Primary
                    </span>}
                </div>
                
                <h3 className="text-lg font-semibold text-primary mb-4">
                  {location.name}
                </h3>

                {/* Google Maps Embed */}
                <div className="w-full h-32 rounded-lg overflow-hidden mb-4 border border-border">
                  <iframe
                    src={location.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${location.name}`}
                  />
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-foreground">{location.address}</p>
                      <p className="text-muted-foreground">{location.city}</p>
                    </div>
                  </div>

                  <a href={`tel:${location.phone.replace(/\s/g, "")}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-secondary/10 transition-colors">
                    <Phone className="h-4 w-4 text-secondary shrink-0" />
                    <span className="text-secondary font-medium">{location.phone}</span>
                  </a>

                  <div className="pt-2 border-t border-border">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div className="space-y-1">
                        {location.timings.map((timing, i) => <p key={i} className="text-foreground text-sm">{timing}</p>)}
                      </div>
                    </div>
                  </div>

                  <a href={location.mapLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary hover:underline text-sm mt-2">
                    <ExternalLink className="h-3.5 w-3.5" />
                    View on Google Maps
                  </a>
                </div>
              </div>)}
          </div>

          {/* Other Hospitals */}
          <div className="bg-card border border-border rounded-lg p-6 mb-12">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              Also Available At
            </h3>
            <div className="flex flex-wrap gap-3">
              {otherHospitals.map((hospital, index) => <span key={index} className="bg-muted px-4 py-2 rounded-full text-sm text-foreground">
                  {hospital}
                </span>)}
            </div>
          </div>

          {/* Quick Contact */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="tel:+919909907475" className="text-center p-6 bg-card rounded-lg border border-border hover:border-secondary transition-colors">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="h-5 w-5 text-secondary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Primary Contact</h4>
              <p className="text-secondary font-medium text-sm">+91 99099 07475</p>
            </a>

            <div className="text-center p-6 bg-destructive/5 rounded-lg border border-destructive/20">
              <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Emergency</h4>
              <a href="tel:+919909907475" className="text-destructive font-medium text-sm hover:underline">
                +91 99099 07475
              </a>
            </div>

            <div className="text-center p-6 bg-card rounded-lg border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-5 w-5 text-secondary" />
              </div>
              <h4 className="font-semibold text-foreground mb-1">Location</h4>
              <p className="text-sm text-muted-foreground">Surat, Gujarat, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section for SEO */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container max-w-3xl">
          <SectionHeading title="Frequently Asked Questions" subtitle="Expert answers about neurosurgery, brain & spine treatment in Surat, Gujarat." />
          
          <div className="space-y-4" itemScope itemType="https://schema.org/FAQPage">
            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                Who is the best neurosurgeon in Surat for brain tumor surgery?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  Dr. Nisarg Parmar is a top-rated NIMHANS-trained neurosurgeon in Surat specializing in brain tumor removal, 
                  craniotomy, and advanced neuro-oncology. With 5000+ successful brain and spine surgeries, 
                  he provides world-class neurosurgical care at SIDS Hospital, Unity Hospital, and Pinnacle Brain & Spine Center.
                </p>
              </div>
            </div>
            
            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                What spine conditions are treated by Dr. Nisarg Parmar in Surat?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  Dr. Parmar treats herniated disc, spinal stenosis, spondylolisthesis, spinal cord injuries, 
                  cervical disc problems, lumbar spine disorders, and spinal tumors. He performs minimally invasive spine surgery, 
                  microdiscectomy, spinal fusion, and endoscopic spine procedures with faster recovery times.
                </p>
              </div>
            </div>

            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                Is 24/7 emergency neurosurgery available in Surat?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  Yes, Dr. Nisarg Parmar provides round-the-clock emergency neurosurgical services in Surat for head injuries, 
                  brain hemorrhage, stroke, spinal trauma, and neurotrauma cases. For neurosurgery emergencies, 
                  call +91 99099 07475 immediately for urgent consultation and treatment.
                </p>
              </div>
            </div>

            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                How to book an appointment with Dr. Nisarg Parmar, neurosurgeon in Surat?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  You can book an appointment online through our website, call us at +91 99099 07475, 
                  or visit our clinic during working hours (Mon-Sat, 10AM-6PM). Dr. Parmar is available at 
                  SIDS Hospital, Unity Hospital, and Pinnacle Brain & Spine Center in Surat.
                </p>
              </div>
            </div>

            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                What is the cost of brain surgery in Surat, Gujarat?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  Brain surgery costs in Surat vary based on the procedure complexity, hospital choice, and patient condition. 
                  Dr. Nisarg Parmar offers transparent pricing with detailed cost estimates during consultation. 
                  Insurance and cashless treatment facilities are available at affiliated hospitals.
                </p>
              </div>
            </div>

            <div className="medical-card" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <h3 className="font-semibold text-foreground mb-2" itemProp="name">
                Does Dr. Parmar perform pediatric neurosurgery in Surat?
              </h3>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p className="text-muted-foreground text-sm" itemProp="text">
                  Yes, Dr. Nisarg Parmar specializes in pediatric neurosurgery for children with brain tumors, 
                  hydrocephalus, spina bifida, craniosynostosis, and congenital brain malformations. 
                  He provides compassionate care with child-friendly treatment approaches.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-8 bg-muted/50">
        <div className="container max-w-3xl">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              The information provided on this website is for educational purposes only and 
              should not be considered as medical advice. Always consult with a qualified 
              healthcare provider for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ChatbotPlaceholder />
    </div>;
};
export default Index;