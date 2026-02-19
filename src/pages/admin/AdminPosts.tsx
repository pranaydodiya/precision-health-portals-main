import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  MapPin, 
  Video, 
  BarChart3, 
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Clock
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  is_published: boolean;
  publish_date: string | null;
  created_at: string;
  views_count: number;
  category: string | null;
}

export default function AdminPosts() {
  const { admin, logout, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, isLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchPosts();
    }
  }, [admin]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, is_published, publish_date, created_at, views_count, category")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error fetching posts", variant: "destructive" });
      return;
    }

    setPosts(data || []);
  };

  const togglePublish = async (post: BlogPost) => {
    const { error } = await supabase
      .from("blog_posts")
      .update({ 
        is_published: !post.is_published,
        publish_date: !post.is_published ? new Date().toISOString() : null
      })
      .eq("id", post.id);

    if (error) {
      toast({ title: "Error updating post", variant: "destructive" });
      return;
    }

    toast({
      title: post.is_published ? "Post unpublished" : "Post published",
      description: post.is_published 
        ? "The post is now a draft" 
        : "The post is now live on your website",
    });

    fetchPosts();
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase
      .from("blog_posts")
      .delete()
      .eq("id", postId);

    if (error) {
      toast({ title: "Error deleting post", variant: "destructive" });
      return;
    }

    toast({ title: "Post deleted" });
    fetchPosts();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading || !admin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || 
      (filter === "published" && post.is_published) || 
      (filter === "draft" && !post.is_published);
    return matchesSearch && matchesFilter;
  });

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: FileText, label: "Blog Posts", href: "/admin/posts", active: true },
    { icon: MapPin, label: "Locations", href: "/admin/locations" },
    { icon: Video, label: "Testimonials", href: "/admin/testimonials" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6 border-b border-border">
          <h2 className="font-bold text-lg text-foreground">Admin Panel</h2>
          <p className="text-xs text-muted-foreground">Dr. Nisarg Parmar</p>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border w-64">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
              <p className="text-muted-foreground text-sm">
                Manage your medical blog content
              </p>
            </div>
            <Link to="/admin/posts/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({posts.length})
              </Button>
              <Button 
                variant={filter === "published" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("published")}
              >
                Published ({posts.filter(p => p.is_published).length})
              </Button>
              <Button 
                variant={filter === "draft" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("draft")}
              >
                Drafts ({posts.filter(p => !p.is_published).length})
              </Button>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-card border border-border rounded-lg">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search term" : "Create your first blog post"}
                </p>
                {!searchQuery && (
                  <Link to="/admin/posts/new">
                    <Button>Create Post</Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="divide-y divide-border">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-4 flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-foreground truncate">{post.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          post.is_published 
                            ? "bg-success/10 text-success" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {post.is_published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {post.excerpt || "No excerpt"}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views_count} views
                        </span>
                        {post.category && (
                          <span className="px-2 py-0.5 bg-muted rounded">
                            {post.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {post.is_published && (
                        <Link to={`/blog/${post.slug}`} target="_blank">
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => togglePublish(post)}
                      >
                        {post.is_published ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Link to={`/admin/posts/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deletePost(post.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
