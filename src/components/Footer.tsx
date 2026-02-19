import { Phone, Mail, MapPin, Clock } from "lucide-react";
export function Footer() {
  return <footer className="bg-primary text-primary-foreground">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4">Dr. Nisarg Parmar</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              NIMHANS trained Neurosurgeon specializing in Brain & Spine Surgery.
              Providing expert neurological care in Gujarat.
            </p>
            <p className="text-xs text-primary-foreground/60">
              MBBS, MS (General Surgery), MCh (Neurosurgery) - NIMHANS
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:underline text-primary-foreground/80">
                  About Doctor
                </a>
              </li>
              <li>
                <a href="#specialties" className="hover:underline text-primary-foreground/80">
                  Specialties
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:underline text-primary-foreground/80">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#appointment" className="hover:underline text-primary-foreground/80">
                  Book Appointment
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:underline text-primary-foreground/80">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h3 className="text-lg font-bold mb-4">Specialties</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>Brain Tumor Surgery</li>
              <li>Spine Surgery</li>
              <li>Neurotrauma Care</li>
              <li>Pediatric Neurosurgery</li>
              <li>Vascular Neurosurgery</li>
              <li>Minimally Invasive Surgery</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <div>
                  <a href="tel:+919909907475" className="hover:underline">
                    +91 99099 07475
                  </a>
                  <p className="text-xs text-primary-foreground/60">24/7 Emergency</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-primary-foreground/80">
                  Surat, Gujarat, India
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="text-primary-foreground/80">
                  Multiple locations with varied timings
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
            <p>© 2026 Dr. Nisarg Parmar. All rights reserved.</p>
            <p className="text-xs text-center">
              Medical Disclaimer: Information provided is for educational purposes only.
              Consult a qualified healthcare provider for medical advice.
            </p>
          </div>
        </div>
      </div>
    </footer>;
}