import { Play } from "lucide-react";
import { memo } from "react";

interface VideoTestimonialCardProps {
  name: string;
  condition: string;
  thumbnailText?: string;
}

export const VideoTestimonialCard = memo(function VideoTestimonialCard({ 
  name, 
  condition, 
  thumbnailText 
}: VideoTestimonialCardProps) {
  return (
    <div className="medical-card group cursor-pointer">
      <div className="relative aspect-video bg-muted rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <Play className="h-5 w-5 text-primary-foreground ml-0.5" fill="currentColor" />
        </div>
        {thumbnailText && (
          <span className="absolute bottom-2 right-2 text-xs bg-foreground/80 text-background px-2 py-0.5 rounded">
            {thumbnailText}
          </span>
        )}
        <div className="absolute top-2 left-2 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded">
          Coming Soon
        </div>
      </div>
      <h4 className="font-semibold text-foreground text-sm">{name}</h4>
      <p className="text-xs text-muted-foreground">{condition}</p>
    </div>
  );
});
