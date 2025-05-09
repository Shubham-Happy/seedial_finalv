import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Image, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { useCreateArticle } from "@/hooks/useArticles";

export default function CreateArticle() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { createArticle, isCreating } = useCreateArticle();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "Image too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }

    setCoverImage(file);
    
    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to publish an article",
        variant: "destructive"
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a title and content for your article",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload cover image if provided
      let imageUrl = null;
      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `article_covers/${fileName}`;

        // Upload to Supabase storage using raw SQL to avoid type issues
        const { error: uploadError } = await supabase.storage
          .from('articles')
          .upload(filePath, coverImage);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('articles')
          .getPublicUrl(filePath);

        imageUrl = publicUrlData.publicUrl;
      }

      // Process tags
      const tagList = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Calculate estimated reading time
      const wordsPerMinute = 200;
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

      // Use the createArticle method from our hook
      createArticle({
        title,
        summary: summary || content.substring(0, 150) + "...",
        content,
        cover_image: imageUrl,
        user_id: profile.id,
        published_at: new Date().toISOString(),
        reading_time: readingTime + " min",
        tags: tagList.length > 0 ? tagList : null
      });

      // Navigate after successful create
      navigate("/articles");
    } catch (error) {
      console.error("Error publishing article:", error);
      toast({
        title: "Publication failed",
        description: "There was a problem publishing your article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="mr-2 h-6 w-6 text-statusnow-purple" />
          Write an Article
        </h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create New Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cover image upload */}
            <div className="space-y-2">
              <label htmlFor="cover-image" className="block text-sm font-medium">
                Cover Image (Optional)
              </label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('cover-image')?.click()}
                  className="flex items-center gap-2"
                >
                  <Image className="h-4 w-4" />
                  {coverImage ? 'Change Image' : 'Upload Image'}
                </Button>
                <input
                  id="cover-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {coverImage && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={removeImage}
                    className="text-red-500"
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="mt-2 relative">
                  <img 
                    src={imagePreview} 
                    alt="Cover preview" 
                    className="max-h-48 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium">
                Article Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling title for your article"
                required
              />
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <label htmlFor="summary" className="block text-sm font-medium">
                Summary (Optional)
              </label>
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Write a brief summary of your article"
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label htmlFor="content" className="block text-sm font-medium">
                Content *
              </label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here..."
                rows={10}
                required
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label htmlFor="tags" className="block text-sm font-medium">
                Tags (Optional, comma separated)
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. Startup, Funding, Technology"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/articles")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Publishing..." : "Publish Article"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
