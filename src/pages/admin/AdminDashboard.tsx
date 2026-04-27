import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  MapPin, 
  Video, 
  BarChart3, 
  LogOut,
  Plus,
  Eye,
  TrendingUp,
  Users,
  Clock,
  ArrowUpRight
} from "lucide-react";

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  totalViews: number;
  totalLocations: number;
  teamMembers: number;
  teamMembersPublished: number;
}

interface RecentPostRow {
  id: string;
  title: string;
  slug: string;
  is_published: boolean | null;
  created_at: string;
  views_count: number | null;
}

export default function AdminDashboard() {
  const { admin, logout, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLocations: 0,
    teamMembers: 0,
    teamMembersPublished: 0,
  });
  const [recentPosts, setRecentPosts] = useState<RecentPostRow[]>([]);

  useEffect(() => {
    if (!isLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, isLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchStats();
      fetchRecentPosts();
    }
  }, [admin]);

  const fetchStats = async () => {
    const [postsResult, locationsResult, analyticsResult, teamResult] = await Promise.all([
      supabase.from("blog_posts").select("id, is_published, views_count"),
      supabase.from("clinic_locations").select("id"),
      supabase.from("page_analytics").select("id"),
      supabase.from("team_members").select("id, is_published"),
    ]);

    const posts = postsResult.data || [];
    const totalViews = posts.reduce((acc, post) => acc + (post.views_count || 0), 0);
    const team = teamResult.data || [];

    setStats({
      totalPosts: posts.length,
      publishedPosts: posts.filter(p => p.is_published).length,
      totalViews: totalViews + (analyticsResult.data?.length || 0),
      totalLocations: locationsResult.data?.length || 0,
      teamMembers: team.length,
      teamMembersPublished: team.filter((m) => m.is_published).length,
    });
  };

  const fetchRecentPosts = async () => {
    const { data } = await supabase
      .from("blog_posts")
      .select("id, title, slug, is_published, created_at, views_count")
      .order("created_at", { ascending: false })
      .limit(5);
    
    setRecentPosts(data || []);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard", active: true },
    { icon: FileText, label: "Blog Posts", href: "/admin/posts" },
    { icon: MapPin, label: "Locations", href: "/admin/locations" },
    { icon: Video, label: "Testimonials", href: "/admin/testimonials" },
    { icon: Users, label: "Team", href: "/admin/team" },
    { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const statCards = [
    { label: "Total Blog Posts", value: stats.totalPosts, icon: FileText, color: "bg-primary/10 text-primary" },
    { label: "Published Posts", value: stats.publishedPosts, icon: Eye, color: "bg-success/10 text-success" },
    { label: "Total Page Views", value: stats.totalViews, icon: TrendingUp, color: "bg-secondary/10 text-secondary" },
    { label: "Clinic Locations", value: stats.totalLocations, icon: MapPin, color: "bg-warning/10 text-warning" },
    {
      label: "Team (published / total)",
      value: `${stats.teamMembersPublished} / ${stats.teamMembers}`,
      icon: Users,
      color: "bg-primary/10 text-primary",
    },
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
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, {admin.email}
              </p>
            </div>
            <Link to="/admin/posts/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Post
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`p-2 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Recent Posts */}
          <div className="bg-card border border-border rounded-lg">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Recent Blog Posts</h2>
              <Link to="/admin/posts" className="text-sm text-primary hover:underline">
                View All
              </Link>
            </div>
            <div className="divide-y divide-border">
              {recentPosts.length === 0 ? (
                <div className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No blog posts yet</p>
                  <Link to="/admin/posts/new">
                    <Button className="mt-4">Create Your First Post</Button>
                  </Link>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <div key={post.id} className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{post.title}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        {new Date(post.created_at).toLocaleDateString()}
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          post.is_published 
                            ? "bg-success/10 text-success" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {post.is_published ? "Published" : "Draft"}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views_count || 0}
                      </span>
                      <Link to={`/admin/posts/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mt-8">
            <Link 
              to="/admin/posts/new" 
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <FileText className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium text-foreground group-hover:text-primary">Create Blog Post</h3>
              <p className="text-sm text-muted-foreground">Write SEO-optimized content</p>
            </Link>
            <Link 
              to="/admin/locations" 
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <MapPin className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium text-foreground group-hover:text-primary">Manage Locations</h3>
              <p className="text-sm text-muted-foreground">Update clinic addresses & timings</p>
            </Link>
            <Link 
              to="/admin/settings" 
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <Settings className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium text-foreground group-hover:text-primary">Site Settings</h3>
              <p className="text-sm text-muted-foreground">SEO, contact info, metadata</p>
            </Link>
            <Link
              to="/admin/team"
              className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors group"
            >
              <Users className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-medium text-foreground group-hover:text-primary">Clinical team</h3>
              <p className="text-sm text-muted-foreground">Doctors and staff on the /team page</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
