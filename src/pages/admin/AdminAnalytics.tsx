import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Eye,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Activity,
} from "lucide-react";

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  weekVisits: number;
  topPages: { path: string; count: number }[];
  recentVisits: { path: string; visited_at: string }[];
  blogStats: { total: number; published: number; views: number };
}

export default function AdminAnalytics() {
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVisits: 0,
    todayVisits: 0,
    weekVisits: 0,
    topPages: [],
    recentVisits: [],
    blogStats: { total: 0, published: 0, views: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (admin) {
      fetchAnalytics();
    }
  }, [admin]);

  const fetchAnalytics = async () => {
    try {
      // Fetch page analytics
      const { data: allVisits } = await supabase
        .from("page_analytics")
        .select("*")
        .order("visited_at", { ascending: false })
        .limit(1000);

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

      const todayVisits = allVisits?.filter(
        (v) => new Date(v.visited_at) >= todayStart
      ).length || 0;

      const weekVisits = allVisits?.filter(
        (v) => new Date(v.visited_at) >= weekStart
      ).length || 0;

      // Calculate top pages
      const pageCounts: Record<string, number> = {};
      allVisits?.forEach((v) => {
        pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Fetch blog stats
      const { data: blogPosts } = await supabase
        .from("blog_posts")
        .select("id, is_published, views_count");

      const totalViews = blogPosts?.reduce((sum, p) => sum + (p.views_count || 0), 0) || 0;
      const publishedCount = blogPosts?.filter((p) => p.is_published).length || 0;

      setAnalytics({
        totalVisits: allVisits?.length || 0,
        todayVisits,
        weekVisits,
        topPages,
        recentVisits: allVisits?.slice(0, 10).map((v) => ({
          path: v.page_path,
          visited_at: v.visited_at,
        })) || [],
        blogStats: {
          total: blogPosts?.length || 0,
          published: publishedCount,
          views: totalViews,
        },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Analytics</h1>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Total Visits</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{analytics.totalVisits.toLocaleString()}</p>
          </div>

          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <span className="text-sm text-muted-foreground">Today</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{analytics.todayVisits.toLocaleString()}</p>
          </div>

          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-secondary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-sm text-muted-foreground">This Week</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{analytics.weekVisits.toLocaleString()}</p>
          </div>

          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <span className="text-sm text-muted-foreground">Blog Views</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{analytics.blogStats.views.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Pages */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Top Pages</h3>
            </div>
            {analytics.topPages.length > 0 ? (
              <div className="space-y-3">
                {analytics.topPages.map((page, index) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-5">{index + 1}.</span>
                      <span className="text-sm text-foreground truncate max-w-[200px]">
                        {page.path === "/" ? "Home" : page.path}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{page.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
            )}
          </div>

          {/* Recent Visits */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Recent Visits</h3>
            </div>
            {analytics.recentVisits.length > 0 ? (
              <div className="space-y-3">
                {analytics.recentVisits.map((visit, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground truncate max-w-[200px]">
                      {visit.path === "/" ? "Home" : visit.path}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(visit.visited_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent visits</p>
            )}
          </div>

          {/* Blog Stats */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Blog Performance</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-foreground">{analytics.blogStats.total}</p>
                <p className="text-xs text-muted-foreground">Total Posts</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-success">{analytics.blogStats.published}</p>
                <p className="text-xs text-muted-foreground">Published</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-primary">{analytics.blogStats.views}</p>
                <p className="text-xs text-muted-foreground">Views</p>
              </div>
            </div>
          </div>

          {/* SEO Health (Mocked) */}
          <div className="bg-card border rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">SEO Health</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Meta Titles</span>
                  <span className="text-success">Good</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[90%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Meta Descriptions</span>
                  <span className="text-success">Good</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[85%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Image Alt Tags</span>
                  <span className="text-warning">Needs Work</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-warning w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Internal Links</span>
                  <span className="text-success">Good</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-success w-[80%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
