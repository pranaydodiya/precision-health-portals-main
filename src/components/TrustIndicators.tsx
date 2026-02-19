import { Award, Users, Clock, Shield } from "lucide-react";

const stats = [
  {
    icon: Award,
    number: "5+",
    label: "Years Experience",
  },
  {
    icon: Users,
    number: "5000+",
    label: "Successful Surgeries",
  },
  {
    icon: Clock,
    number: "24/7",
    label: "Emergency Available",
  },
  {
    icon: Shield,
    number: "NIMHANS",
    label: "Trained Expert",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="trust-stat flex flex-col items-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                <stat.icon className="h-6 w-6 text-secondary" />
              </div>
              <span className="trust-stat-number">{stat.number}</span>
              <span className="trust-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
