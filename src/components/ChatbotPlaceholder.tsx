import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ChatbotPlaceholder() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg transition-transform hover:scale-105 ${
          isOpen ? "hidden" : ""
        }`}
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 sm:w-96 bg-card rounded-lg shadow-xl border border-border animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-primary rounded-t-lg">
            <div>
              <h3 className="font-semibold text-primary-foreground">Medical Assistant</h3>
              <p className="text-xs text-primary-foreground/70">How can we help you?</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-foreground/70 hover:text-primary-foreground"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-64 p-4 overflow-y-auto bg-muted/30">
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg text-sm max-w-[85%]">
                <p>Welcome! I'm here to help you with:</p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• Appointment booking</li>
                  <li>• General inquiries</li>
                  <li>• Clinic timings & location</li>
                </ul>
              </div>
              <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg text-sm">
                <p className="font-medium text-destructive">For emergencies:</p>
                <a
                  href="tel:+919876543210"
                  className="text-destructive underline font-semibold"
                >
                  Call +91 98765 43210
                </a>
              </div>
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                disabled
              />
              <Button size="icon" disabled className="shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Chat coming soon. Please call for assistance.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
