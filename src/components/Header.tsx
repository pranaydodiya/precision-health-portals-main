import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavLink {
  name: string;
  path?: string;
  sectionId?: string;
}

const navLinks: NavLink[] = [
  { name: "Home", sectionId: "hero" },
  { name: "About", sectionId: "about" },
  { name: "Specialties", sectionId: "specialties" },
  { name: "Testimonials", sectionId: "testimonials" },
  { name: "Contact", sectionId: "contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Hidden admin access via logo multi-tap
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Hidden admin access - 5 quick taps on logo
  const handleLogoClick = () => {
    tapCountRef.current += 1;
    
    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }
    
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      navigate("/admin/login");
      return;
    }
    
    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
      scrollToSection("hero");
    }, 500);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isOpen ? "bg-card shadow-sm" : "bg-card"
      }`}
    >
      {/* Top Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container flex items-center justify-between text-xs sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span>Mon-Sat: 10AM-6PM</span>
          </span>
          <a
            href="tel:+919909907475"
            className="flex items-center gap-1.5 font-medium hover:underline"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>+91 99099 07475</span>
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo with hidden admin access */}
          <button 
            onClick={handleLogoClick} 
            className="flex flex-col text-left"
          >
            <span className="text-xl font-bold text-primary">
              Dr. Nisarg Parmar
            </span>
            <span className="text-xs text-muted-foreground">
              Neurosurgeon | Brain & Spine Specialist
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => link.sectionId && scrollToSection(link.sectionId)}
                className="text-sm font-medium transition-colors hover:text-secondary text-foreground"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+919909907475">
              <Button variant="outline" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                Emergency
              </Button>
            </a>
            <Button 
              size="sm" 
              className="bg-secondary hover:bg-secondary/90"
              onClick={() => scrollToSection("appointment")}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation - Full Screen Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 top-[104px] bg-card z-50 animate-fade-in">
          <div className="container py-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => link.sectionId && scrollToSection(link.sectionId)}
                  className="py-4 text-lg font-medium text-foreground hover:text-secondary transition-colors text-left border-b border-border"
                >
                  {link.name}
                </button>
              ))}
              <div className="flex flex-col gap-3 mt-6">
                <Button 
                  className="w-full bg-secondary hover:bg-secondary/90"
                  size="lg"
                  onClick={() => scrollToSection("appointment")}
                >
                  Book Appointment
                </Button>
                <a href="tel:+919909907475" className="w-full">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Phone className="h-5 w-5" />
                    Emergency: +91 99099 07475
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
