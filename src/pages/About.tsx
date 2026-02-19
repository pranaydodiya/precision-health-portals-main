import { CheckCircle, Award, GraduationCap, Building, Star } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ChatbotPlaceholder } from "@/components/ChatbotPlaceholder";
import { SectionHeading } from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const achievements = [
  "Over 5000 successful neurosurgeries",
  "15+ years of dedicated practice",
  "Pioneer in minimally invasive techniques",
  "Published research in international journals",
  "Regular speaker at medical conferences",
  "Member of national neurosurgery associations",
];

const education = [
  {
    degree: "MCh Neurosurgery",
    institution: "National Institute of Mental Health and Neurosciences (NIMHANS)",
    location: "Bangalore, India",
    year: "Premier neurosurgical training",
    highlight: true,
  },
  {
    degree: "MS General Surgery",
    institution: "Reputed Medical College",
    location: "Gujarat, India",
    year: "Surgical foundation",
    highlight: false,
  },
  {
    degree: "MBBS",
    institution: "Medical College",
    location: "Gujarat, India",
    year: "Medical foundation",
    highlight: false,
  },
];

const affiliations = [
  "City Hospital & Research Center, Surat",
  "Apollo Hospitals Network",
  "KIMS Hospital, Gujarat",
  "Sterling Hospital, Vadodara",
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20 bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              About Dr. Nisarg Parmar
            </h1>
            <p className="text-lg text-muted-foreground">
              A NIMHANS trained neurosurgeon dedicated to providing exceptional brain 
              and spine care to patients across Gujarat.
            </p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Photo Placeholder */}
            <div className="relative">
              <div className="aspect-[4/5] bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary">NP</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Professional photo coming soon
                  </p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground px-6 py-3 rounded-lg shadow-lg">
                <p className="font-bold">15+ Years</p>
                <p className="text-sm opacity-90">Experience</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-warning fill-warning" />
                <span className="text-sm font-medium text-muted-foreground">
                  NIMHANS Trained Expert
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                Dr. Nisarg Parmar
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
                  neurosurgeons. His expertise spans complex brain tumor surgeries, intricate 
                  spine procedures, and emergency neurotrauma care.
                </p>
                <p className="text-muted-foreground">
                  Dr. Parmar is committed to providing compassionate, patient-centered care 
                  while employing the latest surgical techniques and technologies. His approach 
                  combines clinical excellence with genuine empathy for each patient's unique 
                  situation.
                </p>
              </div>

              <div className="mt-8">
                <Link to="/appointments">
                  <Button className="bg-secondary hover:bg-secondary/90">
                    Book Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <SectionHeading
            title="Education & Training"
            subtitle="Trained at India's most prestigious medical institutions."
          />

          <div className="max-w-2xl mx-auto space-y-6">
            {education.map((edu, index) => (
              <div
                key={index}
                className={`medical-card ${edu.highlight ? "border-secondary border-2" : ""}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${edu.highlight ? "bg-secondary/10" : "bg-muted"}`}>
                    <GraduationCap className={`h-6 w-6 ${edu.highlight ? "text-secondary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                    <p className="text-secondary font-medium text-sm">{edu.institution}</p>
                    <p className="text-muted-foreground text-sm">{edu.location}</p>
                    {edu.highlight && (
                      <span className="inline-block mt-2 bg-secondary/10 text-secondary text-xs font-medium px-2 py-1 rounded">
                        {edu.year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeading
                title="Achievements & Recognition"
                centered={false}
              />
              <ul className="space-y-3">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary shrink-0" />
                    <span className="text-foreground">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <SectionHeading
                title="Hospital Affiliations"
                centered={false}
              />
              <div className="space-y-4">
                {affiliations.map((affiliation, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                    <Building className="h-5 w-5 text-primary shrink-0" />
                    <span className="text-foreground">{affiliation}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container text-center max-w-3xl">
          <Award className="h-12 w-12 text-secondary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6">
            My Philosophy of Care
          </h2>
          <blockquote className="text-lg md:text-xl text-primary-foreground/90 italic">
            "Every patient deserves not just the best medical treatment, but also 
            compassion, clear communication, and hope. I believe in treating the 
            whole person, not just the condition, and in empowering patients with 
            knowledge about their health."
          </blockquote>
          <p className="mt-6 text-primary-foreground font-medium">
            — Dr. Nisarg Parmar
          </p>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-12 bg-muted/50">
        <div className="container max-w-3xl">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-2">Medical Disclaimer</h3>
            <p className="text-sm text-muted-foreground">
              The information provided on this website is for educational purposes only and 
              should not be considered as medical advice. Always consult with a qualified 
              healthcare provider for proper diagnosis and treatment. The outcomes of 
              medical procedures vary based on individual conditions.
            </p>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ChatbotPlaceholder />
    </div>
  );
};

export default About;
