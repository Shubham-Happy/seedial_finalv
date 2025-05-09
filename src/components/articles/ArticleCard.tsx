
import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    content?: string;
    coverImage?: string;
    author: {
      id: string;
      name: string;
      avatar?: string;
      role?: string;
    };
    publishedAt: string;
    readingTime?: string;
    tags?: string[];
    likes?: number;
    comments?: number;
  };
  className?: string;
  compact?: boolean;
}

export function ArticleCard({ article, className, compact = false }: ArticleCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes || 0);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSaved(!isSaved);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <Link to={`/articles/${article.id}`} className="block">
        {article.coverImage && !compact && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={article.author.avatar} alt={article.author.name} />
              <AvatarFallback className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white">
                {article.author.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{article.author.name}</p>
              <p className="text-xs text-muted-foreground">{article.author.role}</p>
            </div>
          </div>

          <CardTitle className="text-xl">{article.title}</CardTitle>
          
          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{formatDate(article.publishedAt)}</span>
            {article.readingTime && <span>{article.readingTime} read</span>}
          </div>
        </CardHeader>

        {!compact && (
          <CardContent className="p-4 pt-0">
            <CardDescription>{article.summary}</CardDescription>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {article.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="hover-scale">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        )}
      </Link>

      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-4">
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn("flex items-center gap-1 px-2", isLiked && "text-primary")}
            onClick={handleLike}
          >
            <Heart size={18} className={isLiked ? "fill-primary" : ""} />
            <span>{likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 px-2"
            asChild
          >
            <Link to={`/articles/${article.id}#comments`}>
              <MessageSquare size={18} />
              <span>{article.comments || 0}</span>
            </Link>
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
      </CardFooter>
    </Card>
  );
}
