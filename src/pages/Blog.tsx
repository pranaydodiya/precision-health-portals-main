import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SectionHeading } from "@/components/SectionHeading";
import { Calendar, Clock, ArrowRight, Tag, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: string[] | null;
  publish_date: string;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
    trackPageView();
  }, []);

  const trackPageView = async () => {
    await supabase.from("page_analytics").insert({
      page_path: "/blog",
      page_title: "Blog - Dr. Nisarg Parmar",
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, featured_image_url, category, tags, publish_date, created_at")
      .eq("is_published", true)
      .order("publish_date", { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setIsLoading(false);
  };

  const categories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-28 pb-16">
        <div className="container">
          <SectionHeading 
            title="Medical Blog" 
            subtitle="Expert insights on brain and spine health from Dr. Nisarg Parmar"
          />

          {/* Search and Filter */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category as string)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Blog Posts Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No articles found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  {post.featured_image_url && (
                    <Link to={`/blog/${post.slug}`}>
                      <div className="aspect-video overflow-hidden">
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded mb-3">
                        {post.category}
                      </span>
                    )}
                    <Link to={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publish_date || post.created_at)}
                      </span>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        Read More
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
