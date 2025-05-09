
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  ArrowLeft,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useArticleById } from "@/hooks/useArticles";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { article, isLoading, error } = useArticleById(id || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="container max-w-3xl mx-auto py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-12"></div>
          <div className="h-48 bg-muted rounded w-full mb-6"></div>
          <div className="space-y-3 w-full">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Article</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't find the article you're looking for.
        </p>
        <Button asChild>
          <Link to="/articles">Back to Articles</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/articles">Articles</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="max-w-[150px] truncate">
              {article.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8">
        <Link 
          to="/articles"
          className="flex items-center text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Articles
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-10 w-10">
            <AvatarImage src={article.author.avatar} alt={article.author.name} />
            <AvatarFallback className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white">
              {article.author.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <Link to={`/profile/${article.author.id}`} className="font-medium hover:text-statusnow-purple">
              {article.author.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {article.author.role || "Author"} • {formatDate(article.publishedAt)} • {article.readingTime || "5 min"} read
            </p>
          </div>
        </div>

        {article.coverImage && (
          <div className="relative w-full h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-8">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {article.tags && article.tags.map((tag: string, index: number) => (
            <Badge key={index} variant="secondary" className="hover:scale-105 transition-transform">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none mb-8"
             dangerouslySetInnerHTML={{ __html: article.content || article.summary }}
        />

        <div className="flex justify-between items-center my-8 border-t border-b py-4">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className={cn("flex items-center gap-1", isLiked && "text-primary")}
              onClick={handleLike}
            >
              <Heart size={18} className={isLiked ? "fill-primary" : ""} />
              <span>{isLiked ? (article.likes || 0) + 1 : article.likes || 0}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MessageSquare size={18} />
              <span>{article.comments || 0}</span>
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Bookmark size={18} className={isSaved ? "fill-primary" : ""} />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 size={18} />
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-6 rounded-lg mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white">
                {article.author.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <Link to={`/profile/${article.author.id}`} className="font-medium text-lg hover:text-statusnow-purple">
                About {article.author.name}
              </Link>
              <p className="text-sm text-muted-foreground">
                {article.author.role}
              </p>
            </div>

            <Button variant="outline" size="sm" className="ml-auto">
              Follow
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">{article.author.bio || "No bio available"}</p>
        </div>

        <div className="mb-8" id="comments">
          <h2 className="text-xl font-bold mb-4">Comments ({article.comments})</h2>
          
          <div className="mb-6">
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-statusnow-purple focus:border-statusnow-purple"
              rows={3}
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-2">
              <Button disabled={!commentText.trim()}>Post Comment</Button>
            </div>
          </div>

          <div className="space-y-4">
            {(article.commentsList && article.commentsList.length > 0) ? (
              article.commentsList.map((comment: any) => (
                <div key={comment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback className="bg-muted">
                        {comment.author.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link to={`/profile/${comment.author.id}`} className="font-medium hover:underline">
                        {comment.author.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <button className="hover:text-statusnow-purple flex items-center gap-1">
                      <Heart size={14} /> {comment.likes}
                    </button>
                    <button className="hover:text-statusnow-purple">Reply</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
