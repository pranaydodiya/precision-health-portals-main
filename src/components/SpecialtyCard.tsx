import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface SpecialtyCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  link?: string;
}

export function SpecialtyCard({ icon: Icon, title, description, link }: SpecialtyCardProps) {
  const content = (
    <div className="medical-card h-full group cursor-pointer">
      <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
        <Icon className="h-6 w-6 text-secondary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );

  if (link) {
    return <Link to={link}>{content}</Link>;
  }

  return content;
}
