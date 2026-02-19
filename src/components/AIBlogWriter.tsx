import { useState } from "react";
import { Sparkles, Loader2, Lightbulb, FileText, Tags, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BlogIdea {
  title: string;
  description: string;
  keywords: string[];
  intent: string;
}

interface AIBlogWriterProps {
  onContentGenerated: (content: string) => void;
  onMetaGenerated: (meta: {
    title: string;
    description: string;
    slug: string;
    excerpt: string;
    tags: string[];
  }) => void;
}

export function AIBlogWriter({ onContentGenerated, onMetaGenerated }: AIBlogWriterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [action, setAction] = useState<"ideas" | "content" | "meta" | "improve">("ideas");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [content, setContent] = useState("");
  const [ideas, setIdeas] = useState<BlogIdea[]>([]);
  const [generatedContent, setGeneratedContent] = useState("");
  const { toast } = useToast();

  const generateIdeas = async () => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-blog-writer", {
        body: { action: "generate-ideas", topic },
      });

      if (error) throw error;

      if (Array.isArray(data.result)) {
        setIdeas(data.result);
        toast({ title: "Ideas generated!" });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error: any) {
      toast({
        title: "Error generating ideas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({ title: "Please enter a topic", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-blog-writer", {
        body: { action: "generate-content", topic, keywords },
      });

      if (error) throw error;

      setGeneratedContent(data.result);
      toast({ title: "Content generated!" });
    } catch (error: any) {
      toast({
        title: "Error generating content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateMeta = async () => {
    if (!content.trim()) {
      toast({ title: "Please provide content to generate meta", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-blog-writer", {
        body: { action: "generate-meta", content, topic },
      });

      if (error) throw error;

      if (data.result) {
        onMetaGenerated({
          title: data.result.meta_title || "",
          description: data.result.meta_description || "",
          slug: data.result.slug || "",
          excerpt: data.result.excerpt || "",
          tags: data.result.tags || [],
        });
        toast({ title: "SEO metadata generated!" });
        setIsOpen(false);
      }
    } catch (error: any) {
      toast({
        title: "Error generating metadata",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const improveContent = async () => {
    if (!content.trim()) {
      toast({ title: "Please provide content to improve", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-blog-writer", {
        body: { action: "improve-content", content },
      });

      if (error) throw error;

      setGeneratedContent(data.result);
      toast({ title: "Content improved!" });
    } catch (error: any) {
      toast({
        title: "Error improving content",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useGeneratedContent = () => {
    onContentGenerated(generatedContent);
    setIsOpen(false);
    setGeneratedContent("");
    toast({ title: "Content added to editor" });
  };

  const selectIdea = (idea: BlogIdea) => {
    setTopic(idea.title);
    setKeywords(idea.keywords.join(", "));
    setAction("content");
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="gap-2 border-primary/20 hover:border-primary bg-gradient-to-r from-primary/5 to-secondary/5"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        AI Writer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Blog Writer
            </DialogTitle>
          </DialogHeader>

          <Tabs value={action} onValueChange={(v) => setAction(v as typeof action)}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="ideas" className="gap-1">
                <Lightbulb className="h-3 w-3" />
                Ideas
              </TabsTrigger>
              <TabsTrigger value="content" className="gap-1">
                <FileText className="h-3 w-3" />
                Content
              </TabsTrigger>
              <TabsTrigger value="meta" className="gap-1">
                <Tags className="h-3 w-3" />
                SEO Meta
              </TabsTrigger>
              <TabsTrigger value="improve" className="gap-1">
                <Wand2 className="h-3 w-3" />
                Improve
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ideas" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Topic Focus</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., spine health, brain tumor treatment, minimally invasive surgery"
                />
              </div>
              <Button onClick={generateIdeas} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Lightbulb className="h-4 w-4 mr-2" />
                )}
                Generate Blog Ideas
              </Button>

              {ideas.length > 0 && (
                <div className="space-y-3 mt-4">
                  <Label>Click an idea to write about it:</Label>
                  {ideas.map((idea, index) => (
                    <div
                      key={index}
                      onClick={() => selectIdea(idea)}
                      className="p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <h4 className="font-medium text-foreground">{idea.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{idea.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {idea.keywords.map((kw, i) => (
                          <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Blog Topic/Title</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter the blog topic or title"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Keywords (optional)</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., spine surgery, back pain treatment"
                />
              </div>
              <Button onClick={generateContent} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                Generate Full Blog Post
              </Button>

              {generatedContent && (
                <div className="mt-4">
                  <Label>Generated Content</Label>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="h-64 font-mono text-sm mt-2"
                  />
                  <Button onClick={useGeneratedContent} className="mt-3 w-full">
                    Use This Content
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="meta" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Blog Content</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your blog content here to generate SEO metadata..."
                  className="h-48"
                />
              </div>
              <div className="space-y-2">
                <Label>Topic (optional)</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Main topic for better keyword targeting"
                />
              </div>
              <Button onClick={generateMeta} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Tags className="h-4 w-4 mr-2" />
                )}
                Generate SEO Metadata
              </Button>
            </TabsContent>

            <TabsContent value="improve" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Content to Improve</Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your blog content here to improve it..."
                  className="h-48"
                />
              </div>
              <Button onClick={improveContent} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Improve Content for SEO
              </Button>

              {generatedContent && (
                <div className="mt-4">
                  <Label>Improved Content</Label>
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="h-64 font-mono text-sm mt-2"
                  />
                  <Button onClick={useGeneratedContent} className="mt-3 w-full">
                    Use Improved Content
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
