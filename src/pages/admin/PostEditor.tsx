import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  ArrowLeft,
  Save,
  Eye,
  Loader2,
  Plus,
  X,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/RichTextEditor";
import { ImageUpload } from "@/components/ImageUpload";

interface PostFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  featured_image_url: string;
  category: string;
  tags: string[];
  faq_schema: Array<{ question: string; answer: string }>;
  is_published: boolean;
}

const initialFormData: PostFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  meta_title: "",
  meta_description: "",
  featured_image_url: "",
  category: "",
  tags: [],
  faq_schema: [],
  is_published: false,
};

export default function PostEditor() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { admin, isLoading: authLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  useEffect(() => {
    if (!authLoading && !admin) {
      navigate("/admin/login");
    }
  }, [admin, authLoading, navigate]);

  useEffect(() => {
    if (isEditing && admin) {
      fetchPost();
    }
  }, [id, admin]);

  const fetchPost = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      toast({ title: "Post not found", variant: "destructive" });
      navigate("/admin/posts");
      return;
    }

    setFormData({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || "",
      content: data.content,
      meta_title: data.meta_title || "",
      meta_description: data.meta_description || "",
      featured_image_url: data.featured_image_url || "",
      category: data.category || "",
      tags: data.tags || [],
      faq_schema: (data.faq_schema as any[]) || [],
      is_published: data.is_published,
    });
    setIsLoading(false);
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: isEditing ? prev.slug : generateSlug(title),
      meta_title: prev.meta_title || title,
    }));
  };

  const handleChange = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFormData(prev => ({
        ...prev,
        faq_schema: [...prev.faq_schema, { ...newFaq }],
      }));
      setNewFaq({ question: "", answer: "" });
    }
  };

  const removeFaq = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faq_schema: prev.faq_schema.filter((_, i) => i !== index),
    }));
  };

  // Autosave draft
  const autosave = useCallback(async () => {
    if (!formData.title) return;
    
    if (isEditing && id) {
      await supabase.from("blog_drafts").upsert([{
        post_id: id,
        content: JSON.parse(JSON.stringify(formData)),
        saved_at: new Date().toISOString(),
      }], { onConflict: 'post_id' });
    }
    setLastSaved(new Date());
  }, [formData, id, isEditing]);

  useEffect(() => {
    const timer = setTimeout(autosave, 30000); // Autosave every 30 seconds
    return () => clearTimeout(timer);
  }, [formData, autosave]);

  const savePost = async (publish: boolean = false) => {
    if (!formData.title || !formData.content) {
      toast({ 
        title: "Required fields missing", 
        description: "Title and content are required",
        variant: "destructive" 
      });
      return;
    }

    setIsSaving(true);

    const postData = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      meta_title: formData.meta_title || formData.title,
      meta_description: formData.meta_description || formData.excerpt,
      featured_image_url: formData.featured_image_url,
      category: formData.category,
      tags: formData.tags,
      faq_schema: formData.faq_schema,
      is_published: publish ? true : formData.is_published,
      publish_date: publish ? new Date().toISOString() : null,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert(postData);

        if (error) throw error;
      }

      toast({
        title: publish ? "Post published!" : "Post saved",
        description: publish 
          ? "Your post is now live" 
          : "Changes have been saved",
      });

      navigate("/admin/posts");
    } catch (error: any) {
      toast({
        title: "Error saving post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/posts")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-semibold text-foreground">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
            {lastSaved && (
              <span className="text-xs text-muted-foreground">
                Last saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => savePost(false)}
              disabled={isSaving}
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button 
              onClick={() => savePost(true)}
              disabled={isSaving}
              className="bg-success hover:bg-success/90"
            >
              {formData.is_published ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Update
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="content">
            <TabsList className="mb-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="faq">FAQ Schema</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter post title"
                  className="text-lg"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-sm">/blog/</span>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => handleChange("slug", e.target.value)}
                    placeholder="url-slug"
                  />
                </div>
              </div>

              {/* Featured Image */}
              <div className="space-y-2">
                <Label>Featured Image</Label>
                <ImageUpload
                  value={formData.featured_image_url}
                  onChange={(url) => handleChange("featured_image_url", url)}
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleChange("excerpt", e.target.value)}
                  placeholder="Brief summary of the post (160 characters recommended)"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {formData.excerpt.length}/160 characters
                </p>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label>Content *</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => handleChange("content", value)}
                  placeholder="Write your blog content here... (Markdown supported)"
                  minHeight="400px"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  placeholder="e.g., Brain Surgery, Spine Health, Patient Education"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-destructive">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              {/* SEO Title */}
              <div className="space-y-2">
                <Label htmlFor="meta_title">SEO Title</Label>
                <Input
                  id="meta_title"
                  value={formData.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                  placeholder="SEO optimized title (60 characters max)"
                />
                <p className={`text-xs ${formData.meta_title.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                  {formData.meta_title.length}/60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  placeholder="Compelling description for search engines (160 characters max)"
                  rows={3}
                />
                <p className={`text-xs ${formData.meta_description.length > 160 ? "text-destructive" : "text-muted-foreground"}`}>
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              {/* SEO Preview */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2">Search Preview</h4>
                <div className="bg-card rounded p-3">
                  <p className="text-primary text-lg hover:underline cursor-pointer">
                    {formData.meta_title || formData.title || "Page Title"}
                  </p>
                  <p className="text-success text-sm">
                    yoursite.com/blog/{formData.slug || "url-slug"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {formData.meta_description || formData.excerpt || "Meta description will appear here..."}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">FAQ Schema for Rich Snippets</h4>
                  <p className="text-sm text-muted-foreground">
                    Adding FAQs helps your content appear in Google's rich search results with expandable questions.
                  </p>
                </div>
              </div>

              {/* Existing FAQs */}
              <div className="space-y-4">
                {formData.faq_schema.map((faq, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs text-muted-foreground">FAQ #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeFaq(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-medium text-foreground mb-1">{faq.question}</p>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>

              {/* Add New FAQ */}
              <div className="bg-muted rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add FAQ</h4>
                <div className="space-y-2">
                  <Label htmlFor="faq_question">Question</Label>
                  <Input
                    id="faq_question"
                    value={newFaq.question}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                    placeholder="What is the recovery time for brain surgery?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="faq_answer">Answer</Label>
                  <Textarea
                    id="faq_answer"
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                    placeholder="Recovery time varies depending on the type of surgery..."
                    rows={3}
                  />
                </div>
                <Button onClick={addFaq} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
