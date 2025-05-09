
import { useState } from "react";
import { ThumbsUp, ThumbsDown, BookmarkPlus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialShare } from "@/components/sharing/SocialShare";
import { toast } from "@/hooks/use-toast";

interface ArticleEngagementProps {
  articleId: string;
  initialLikes?: number;
  initialDislikes?: number;
  initialBookmarked?: boolean;
  initialLiked?: boolean;
  initialDisliked?: boolean;
  url: string;
  title: string;
  compact?: boolean;
}

export function ArticleEngagement({ 
  articleId,
  initialLikes = 0,
  initialDislikes = 0,
  initialBookmarked = false,
  initialLiked = false,
  initialDisliked = false,
  url,
  title,
  compact = false
}: ArticleEngagementProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isDisliked, setIsDisliked] = useState(initialDisliked);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

  const handleLike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      setDislikes(dislikes - 1);
    }
    
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
      toast({
        title: "Removed like",
        description: "You've removed your like from this article.",
      });
    } else {
      setIsLiked(true);
      setLikes(likes + 1);
      toast({
        title: "Article liked",
        description: "You've liked this article.",
      });
    }
  };

  const handleDislike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikes(likes - 1);
    }
    
    if (isDisliked) {
      setIsDisliked(false);
      setDislikes(dislikes - 1);
      toast({
        title: "Removed dislike",
        description: "You've removed your dislike from this article.",
      });
    } else {
      setIsDisliked(true);
      setDislikes(dislikes + 1);
      toast({
        title: "Article disliked",
        description: "You've disliked this article.",
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Article removed from bookmarks" : "Article bookmarked",
      description: isBookmarked 
        ? "This article has been removed from your bookmarks." 
        : "This article has been saved to your bookmarks.",
    });
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={`px-2 ${isLiked ? "text-statusnow-purple" : ""}`}
          onClick={handleLike}
        >
          <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes > 0 ? likes : ""}</span>
        </Button>
        
        <SocialShare 
          url={url}
          title={title}
          compact={true}
        />
        
        <Button
          variant="ghost"
          size="sm"
          className={`px-2 ${isBookmarked ? "text-statusnow-purple" : ""}`}
          onClick={handleBookmark}
        >
          <BookmarkPlus className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className={isLiked ? "bg-statusnow-purple/10 text-statusnow-purple" : ""}
          onClick={handleLike}
        >
          <ThumbsUp className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className={isDisliked ? "bg-statusnow-purple/10 text-statusnow-purple" : ""}
          onClick={handleDislike}
        >
          <ThumbsDown className={`h-4 w-4 mr-2 ${isDisliked ? "fill-current" : ""}`} />
          <span>{dislikes}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className={isBookmarked ? "bg-statusnow-purple/10 text-statusnow-purple" : ""}
          onClick={handleBookmark}
        >
          <BookmarkPlus className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`} />
          <span>Save</span>
        </Button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Share this article</h3>
        <SocialShare 
          url={url}
          title={title}
        />
      </div>
    </div>
  );
}
