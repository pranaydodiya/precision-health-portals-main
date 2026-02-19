import { 
  Brain, 
  Activity, 
  HeartPulse, 
  Baby, 
  Droplets, 
  Minimize2,
  ArrowRight 
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatbotPlaceholder } from "@/components/ChatbotPlaceholder";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const specialties = [
  {
    icon: Brain,
    title: "Brain Tumor Surgery",
    description: "Advanced surgical treatment for brain tumors with precision and care.",
    details: [
      "Primary and metastatic brain tumors",
      "Benign and malignant tumor removal",
      "Skull base tumor surgery",
      "Stereotactic biopsy",
      "Awake craniotomy when needed",
      "Post-operative rehabilitation coordination",
    ],
    keywords: "brain tumor surgery Gujarat, brain cancer treatment Surat, neurosurgeon brain tumor",
  },
  {
    icon: Activity,
    title: "Spine Surgery",
    description: "Comprehensive spine surgery solutions for disc, deformity, and trauma cases.",
    details: [
      "Disc herniation and slipped disc treatment",
      "Spinal stenosis decompression",
      "Spinal fusion and stabilization",
      "Scoliosis and kyphosis correction",
      "Spinal tumor removal",
      "Minimally invasive spine procedures",
    ],
    keywords: "spine surgery Gujarat, disc surgery Surat, best spine surgeon",
  },
  {
    icon: HeartPulse,
    title: "Neurotrauma Care",
    description: "Emergency neurosurgical care for head and spine injuries.",
    details: [
      "Emergency head injury management",
      "Subdural and epidural hematoma",
      "Skull fracture treatment",
      "Spinal cord injury care",
      "Decompressive craniectomy",
      "24/7 emergency availability",
    ],
    keywords: "emergency neurosurgeon Gujarat, head injury treatment, neurotrauma specialist",
  },
  {
    icon: Baby,
    title: "Pediatric Neurosurgery",
    description: "Specialized care for children with neurological conditions.",
    details: [
      "Hydrocephalus and shunt surgery",
      "Congenital brain malformations",
      "Pediatric brain tumors",
      "Spina bifida treatment",
      "Craniosynostosis correction",
      "Child-friendly care environment",
    ],
    keywords: "pediatric neurosurgeon Gujarat, child brain surgery, hydrocephalus treatment",
  },
  {
    icon: Droplets,
    title: "Vascular Neurosurgery",
    description: "Treatment of aneurysms, AVMs, and other vascular brain conditions.",
    details: [
      "Brain aneurysm clipping",
      "Arteriovenous malformation (AVM) surgery",
      "Cavernoma removal",
      "Moyamoya disease treatment",
      "Intracranial hemorrhage management",
      "Stroke-related surgeries",
    ],
    keywords: "brain aneurysm surgery Gujarat, AVM treatment, vascular neurosurgery",
  },
  {
    icon: Minimize2,
    title: "Minimally Invasive Neurosurgery",
    description: "Advanced techniques for faster recovery and minimal scarring.",
    details: [
      "Endoscopic brain surgery",
      "Tubular retractor-based surgery",
      "Image-guided procedures",
      "Minimally invasive spine surgery (MISS)",
      "Percutaneous procedures",
      "Faster recovery times",
    ],
    keywords: "minimally invasive spine surgery Gujarat, endoscopic brain surgery, keyhole surgery",
  },
];

const Specialties = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Our Specialties
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive neurosurgical services using advanced techniques and 
              technology for optimal patient outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Specialties List */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="space-y-12 md:space-y-16">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                id={specialty.title.toLowerCase().replace(/\s+/g, "-")}
                className="scroll-mt-32"
              >
                <div className={`grid lg:grid-cols-2 gap-8 items-start ${index % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <specialty.icon className="h-7 w-7 text-secondary" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-primary">
                          {specialty.title}
                        </h2>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6">
                      {specialty.description}
                    </p>

                    <h3 className="font-semibold text-foreground mb-3">
                      Conditions & Procedures:
                    </h3>
                    <ul className="space-y-2 mb-6">
                      {specialty.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>

                    <Link to="/appointments">
                      <Button className="bg-secondary hover:bg-secondary/90 gap-2">
                        Book Consultation
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className={`bg-muted rounded-lg p-8 flex items-center justify-center min-h-[250px] ${index % 2 === 1 ? "lg:col-start-1" : ""}`}>
                    <specialty.icon className="h-24 w-24 text-primary/20" />
                  </div>
                </div>

                {index < specialties.length - 1 && (
                  <div className="border-b border-border mt-12 md:mt-16" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Need a Consultation?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Discuss your condition with Dr. Nisarg Parmar and explore the best 
            treatment options for your specific needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/appointments">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Book Appointment
              </Button>
            </Link>
            <a href="tel:+919876543210">
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Call: +91 98765 43210
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Expert Neurosurgical Care in Gujarat
          </h2>
          <p className="text-muted-foreground text-sm mb-4">
            Dr. Nisarg Parmar provides comprehensive neurosurgical services across Gujarat, 
            including Surat, Ahmedabad, Vadodara, Rajkot, and surrounding areas. With 
            NIMHANS training and over 15 years of experience, patients receive world-class 
            care for all brain and spine conditions.
          </p>
          <p className="text-muted-foreground text-sm">
            Whether you need treatment for brain tumors, spine disorders, traumatic injuries, 
            or pediatric neurological conditions, our practice offers advanced surgical 
            techniques, personalized care plans, and dedicated post-operative support.
          </p>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ChatbotPlaceholder />
    </div>
  );
};

export default Specialties;
