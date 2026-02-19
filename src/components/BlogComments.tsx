import { useState, useEffect } from "react";
import { MessageSquare, Send, User, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
  parent_id: string | null;
}

interface BlogCommentsProps {
  postId: string;
}

export function BlogComments({ postId }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    content: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_comments")
        .select("*")
        .eq("post_id", postId)
        .eq("is_approved", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("blog_comments").insert({
        post_id: postId,
        author_name: formData.name.trim(),
        author_email: formData.email.trim(),
        content: formData.content.trim(),
      });

      if (error) throw error;

      setIsSubmitted(true);
      setFormData({ name: "", email: "", content: "" });
      toast({
        title: "Comment submitted!",
        description: "Your comment will appear after moderation.",
      });
    } catch (error: any) {
      toast({
        title: "Error submitting comment",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-primary" />
        Comments ({comments.length})
      </h3>

      {/* Comment Form */}
      <div className="bg-muted/30 rounded-lg p-6 mb-8">
        <h4 className="font-medium text-foreground mb-4">Leave a Comment</h4>
        
        {isSubmitted ? (
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
            <p className="text-foreground font-medium">Thank you for your comment!</p>
            <p className="text-sm text-muted-foreground">
              Your comment will be visible after moderation.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsSubmitted(false)}
            >
              Submit Another Comment
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comment-name">Name *</Label>
                <Input
                  id="comment-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comment-email">Email *</Label>
                <Input
                  id="comment-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment-content">Comment *</Label>
              <Textarea
                id="comment-content"
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              Post Comment
            </Button>
          </form>
        )}
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-card border border-border rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{comment.author_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
