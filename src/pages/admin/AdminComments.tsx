import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Check,
  X,
  Trash2,
  MessageSquare,
  Loader2,
  User,
  Mail,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Comment {
  id: string;
  post_id: string;
  author_name: string;
  author_email: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  blog_posts?: { title: string; slug: string };
}

export default function AdminComments() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchComments();
    }
  }, [admin]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("blog_comments")
      .select(`
        *,
        blog_posts (title, slug)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setIsLoading(false);
  };

  const approveComment = async (id: string) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: true })
      .eq("id", id);

    if (error) {
      toast({ title: "Error approving comment", variant: "destructive" });
    } else {
      toast({ title: "Comment approved" });
      fetchComments();
    }
  };

  const rejectComment = async (id: string) => {
    const { error } = await supabase
      .from("blog_comments")
      .update({ is_approved: false })
      .eq("id", id);

    if (error) {
      toast({ title: "Error rejecting comment", variant: "destructive" });
    } else {
      toast({ title: "Comment rejected" });
      fetchComments();
    }
  };

  const deleteComment = async () => {
    if (!deleteId) return;

    const { error } = await supabase
      .from("blog_comments")
      .delete()
      .eq("id", deleteId);

    if (error) {
      toast({ title: "Error deleting comment", variant: "destructive" });
    } else {
      toast({ title: "Comment deleted" });
      setDeleteId(null);
      fetchComments();
    }
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.is_approved;
    if (filter === "approved") return c.is_approved;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              Comments ({comments.length})
            </h1>
          </div>
          <div className="flex gap-2">
            {["all", "pending", "approved"].map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f as typeof filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f === "pending" && (
                  <span className="ml-1 bg-destructive/20 text-destructive px-1.5 py-0.5 rounded text-xs">
                    {comments.filter((c) => !c.is_approved).length}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <div className="container py-8">
        {filteredComments.length > 0 ? (
          <div className="space-y-4">
            {filteredComments.map((comment) => (
              <div
                key={comment.id}
                className={`bg-card border rounded-lg p-5 ${
                  !comment.is_approved ? "border-warning/50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {comment.author_name}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {comment.author_email}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          comment.is_approved
                            ? "bg-success/10 text-success"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        {comment.is_approved ? "Approved" : "Pending"}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 whitespace-pre-wrap">
                      {comment.content}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{formatDate(comment.created_at)}</span>
                      {comment.blog_posts && (
                        <span className="text-primary">
                          on: {comment.blog_posts.title}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {!comment.is_approved ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success/20 hover:bg-success/10"
                        onClick={() => approveComment(comment.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-warning border-warning/20 hover:bg-warning/10"
                        onClick={() => rejectComment(comment.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive border-destructive/20 hover:bg-destructive/10"
                      onClick={() => setDeleteId(comment.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No comments found
            </h3>
            <p className="text-muted-foreground">
              {filter === "pending"
                ? "No pending comments to review"
                : "Comments will appear here when users submit them"}
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              comment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteComment} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
