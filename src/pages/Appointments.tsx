import { useState } from "react";
import { Calendar, Clock, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatbotPlaceholder } from "@/components/ChatbotPlaceholder";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
];

const Appointments = () => {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    condition: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.phone || !formData.date) {
      toast({
        title: "Please fill required fields",
        description: "Name, phone number, and preferred date are required.",
        variant: "destructive",
      });
      return;
    }

    // Simulate submission
    setIsSubmitted(true);
    toast({
      title: "Appointment Request Received",
      description: "We will contact you shortly to confirm your appointment.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <section className="pt-32 pb-24 md:pt-40">
          <div className="container max-w-lg">
            <div className="text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Appointment Request Received!
              </h1>
              <p className="text-muted-foreground mb-8">
                Thank you, {formData.name}. We have received your appointment request 
                for {formData.date}. Our team will contact you at {formData.phone} 
                within 2 hours to confirm your appointment.
              </p>
              
              <div className="medical-card text-left mb-8">
                <h2 className="font-semibold text-foreground mb-4">Request Summary</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Name:</dt>
                    <dd className="text-foreground font-medium">{formData.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Phone:</dt>
                    <dd className="text-foreground font-medium">{formData.phone}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Preferred Date:</dt>
                    <dd className="text-foreground font-medium">{formData.date}</dd>
                  </div>
                  {formData.time && (
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Preferred Time:</dt>
                      <dd className="text-foreground font-medium">{formData.time}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="outline"
                  className="w-full"
                >
                  Book Another Appointment
                </Button>
                <p className="text-sm text-muted-foreground">
                  For urgent cases, please call{" "}
                  <a href="tel:+919876543210" className="text-secondary font-medium hover:underline">
                    +91 98765 43210
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <WhatsAppButton />
        <ChatbotPlaceholder />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Book an Appointment
            </h1>
            <p className="text-lg text-muted-foreground">
              Schedule a consultation with Dr. Nisarg Parmar. We'll confirm your 
              appointment within 2 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-destructive/10 border-y border-destructive/20 py-4">
        <div className="container">
          <div className="flex items-center justify-center gap-3 text-center">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Emergency?</strong> Don't wait. Call immediately:{" "}
              <a href="tel:+919876543210" className="text-destructive font-semibold hover:underline">
                +91 98765 43210
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="medical-card">
                <h2 className="text-xl font-semibold text-primary mb-6">
                  Appointment Request Form
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <option value="">Select a time slot</option>
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition / Reason for Visit</Label>
                    <Input
                      id="condition"
                      name="condition"
                      placeholder="e.g., Back pain, Brain scan follow-up, Second opinion"
                      value={formData.condition}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Additional Information</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Any additional details about your condition or special requirements..."
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90" size="lg">
                    Request Appointment
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this form, you agree to be contacted regarding your 
                    appointment request.
                  </p>
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
                    <span className="text-foreground font-medium">10:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="text-foreground font-medium">10:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="text-foreground font-medium">Closed</span>
                  </div>
                </div>
              </div>

              <div className="medical-card">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Appointments</p>
                    <a href="tel:+919876543210" className="text-secondary font-medium hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Emergency (24/7)</p>
                    <a href="tel:+919876543210" className="text-destructive font-medium hover:underline">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>

              <div className="medical-card">
                <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  What to Bring
                </h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    Previous medical records
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    MRI/CT scan reports & images
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    Current medications list
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    Insurance documents (if applicable)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                    ID proof
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ChatbotPlaceholder />
    </div>
  );
};

export default Appointments;
