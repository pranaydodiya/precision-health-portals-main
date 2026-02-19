import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Calendar, Clock, ArrowLeft, Tag, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  featured_image_url: string | null;
  author_name: string;
  category: string | null;
  tags: string[] | null;
  faq_schema: Array<{ question: string; answer: string }> | null;
  publish_date: string;
  created_at: string;
  views_count: number;
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error || !data) {
      setIsLoading(false);
      return;
    }

    setPost({
      ...data,
      faq_schema: data.faq_schema as Array<{ question: string; answer: string }> | null
    } as BlogPostData);
    
    // Increment view count
    await supabase
      .from("blog_posts")
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq("id", data.id);

    // Track page view
    await supabase.from("page_analytics").insert({
      page_path: `/blog/${slug}`,
      page_title: data.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
    });

    // Fetch related posts
    if (data.category) {
      const { data: related } = await supabase
        .from("blog_posts")
        .select("id, title, slug, excerpt, featured_image_url")
        .eq("is_published", true)
        .eq("category", data.category)
        .neq("id", data.id)
        .limit(3);
      
      setRelatedPosts(related || []);
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    return content
      .split("\n\n")
      .map((paragraph, i) => {
        // Handle headings
        if (paragraph.startsWith("### ")) {
          return <h3 key={i} className="text-xl font-semibold text-foreground mt-8 mb-4">{paragraph.slice(4)}</h3>;
        }
        if (paragraph.startsWith("## ")) {
          return <h2 key={i} className="text-2xl font-bold text-foreground mt-10 mb-4">{paragraph.slice(3)}</h2>;
        }
        // Handle lists
        if (paragraph.startsWith("- ") || paragraph.startsWith("* ")) {
          const items = paragraph.split("\n").filter(Boolean);
          return (
            <ul key={i} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^[-*] /, "")}</li>
              ))}
            </ul>
          );
        }
        // Regular paragraph
        return <p key={i} className="text-muted-foreground leading-relaxed mb-4">{paragraph}</p>;
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-28 pb-16">
          <div className="container text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist.</p>
            <Link to="/blog">
              <Button>Back to Blog</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate FAQ Schema JSON-LD
  const faqSchema = post.faq_schema && post.faq_schema.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": post.faq_schema.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // Article Schema JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    "headline": post.title,
    "description": post.meta_description || post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Person",
      "name": post.author_name,
      "jobTitle": "Neurosurgeon",
      "affiliation": {
        "@type": "MedicalOrganization",
        "name": "Dr. Nisarg Parmar Neurosurgery Clinic"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dr. Nisarg Parmar",
      "logo": {
        "@type": "ImageObject",
        "url": "https://drnisargparmar.com/logo.png"
      }
    },
    "datePublished": post.publish_date || post.created_at,
    "dateModified": post.created_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://drnisargparmar.com/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{post.meta_title || post.title} | Dr. Nisarg Parmar</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <meta property="og:title" content={post.meta_title || post.title} />
        <meta property="og:description" content={post.meta_description || post.excerpt || ""} />
        {post.featured_image_url && <meta property="og:image" content={post.featured_image_url} />}
        <meta property="og:type" content="article" />
        <link rel="canonical" href={`https://drnisargparmar.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
      </Helmet>

      <Header />
      
      <main className="pt-28 pb-16">
        <article className="container max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link to="/blog" className="flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block bg-primary/10 text-primary text-sm px-3 py-1 rounded-full mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author_name}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(post.publish_date || post.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {Math.ceil(post.content.split(" ").length / 200)} min read
              </span>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* Medical Disclaimer */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-8">
            <p className="text-sm text-foreground">
              <strong>Medical Disclaimer:</strong> This article is for informational purposes only and should not be considered medical advice. Please consult with Dr. Nisarg Parmar or another qualified healthcare provider for personalized medical guidance.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-slate max-w-none">
            {renderContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-border">
              <div className="flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="bg-muted px-3 py-1 rounded-full text-sm text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {post.faq_schema && post.faq_schema.length > 0 && (
            <section className="mt-12 pt-8 border-t border-border">
              <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {post.faq_schema.map((faq, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA */}
          <div className="mt-12 bg-primary text-primary-foreground rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold mb-2">Need Expert Consultation?</h3>
            <p className="mb-4 text-primary-foreground/90">
              Book an appointment with Dr. Nisarg Parmar for personalized care.
            </p>
            <Link to="/#appointment">
              <Button variant="secondary" size="lg">
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedPosts.map((related) => (
                  <Link 
                    key={related.id}
                    to={`/blog/${related.slug}`}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <h3 className="font-medium text-foreground line-clamp-2">{related.title}</h3>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{related.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </article>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
