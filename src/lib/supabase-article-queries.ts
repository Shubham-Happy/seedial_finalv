import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  coverImage?: string;
  author: Author;
  publishedAt: string;
  readingTime?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  commentsList?: any[];  // Adding this property to match usage in ArticleDetail.tsx
}

export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const { data: articlesData, error } = await supabase
      .from('articles')
      .select(`
        *,
        user_id
      `)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching articles:", error);
      throw error;
    }

    // Fetch author information for each article
    const articles = await Promise.all(
      articlesData.map(async (article) => {
        // Get user profile info for the author
        const { data: authorProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', article.user_id)
          .single();
        
        // Transform the data to match our Article interface
        return {
          id: article.id,
          title: article.title,
          summary: article.summary,
          content: article.content,
          coverImage: article.cover_image,
          author: {
            id: article.user_id,
            name: authorProfile?.full_name || authorProfile?.username || "Anonymous",
            avatar: authorProfile?.avatar_url,
            role: "Author", // Default role
            bio: authorProfile?.status || "Writer at Statusnow" // Adding bio from profile status
          },
          publishedAt: article.published_at,
          readingTime: article.reading_time || "5 min",
          tags: article.tags || [],
          likes: 0, // We'll implement this later
          comments: 0, // We'll implement this later
          commentsList: [] // Adding empty array for comments list
        };
      })
    );
    
    return articles;
  } catch (error) {
    console.error("Error processing articles:", error);
    return [];
  }
};

export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        *,
        user_id
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error fetching article with id ${id}:`, error);
      return null;
    }

    // Get user profile info for the author
    const { data: authorProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', article.user_id)
      .single();
    
    return {
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      coverImage: article.cover_image,
      author: {
        id: article.user_id,
        name: authorProfile?.full_name || authorProfile?.username || "Anonymous",
        avatar: authorProfile?.avatar_url,
        role: "Author", // Default role
        bio: authorProfile?.status || "Writer at Statusnow" // Adding bio from profile status
      },
      publishedAt: article.published_at,
      readingTime: article.reading_time || "5 min",
      tags: article.tags || [],
      likes: 0, // We'll implement this later
      comments: 0, // We'll implement this later
      commentsList: [] // Adding empty array for comments list
    };
  } catch (error) {
    console.error(`Error fetching article with id ${id}:`, error);
    return null;
  }
};
