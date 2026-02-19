import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  text: string;
  date?: string;
}

export function TestimonialCard({ name, location, rating, text, date }: TestimonialCardProps) {
  return (
    <div className="medical-card h-full flex flex-col">
      {/* Name first */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{location}</p>
        </div>
        {date && (
          <span className="text-xs text-muted-foreground">{date}</span>
        )}
      </div>
      
      {/* Star rating */}
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-warning text-warning" : "text-muted"
            }`}
          />
        ))}
      </div>
      
      {/* Review text */}
      <p className="text-foreground text-sm leading-relaxed flex-1">"{text}"</p>
    </div>
  );
}
