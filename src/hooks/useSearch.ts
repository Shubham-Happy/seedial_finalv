
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  type: 'people' | 'jobs' | 'articles' | 'companies' | 'all';
  data: any[] | {
    people: any[];
    jobs: any[];
    articles: any[];
    companies: any[];
  };
}

export const useSearch = (searchTerm: string, type?: string) => {
  const fetchSearchResults = async (): Promise<SearchResult> => {
    if (!searchTerm) {
      return { type: type as any || 'people', data: [] };
    }

    try {
      let peoplePromise, jobsPromise, articlesPromise, companiesPromise;
      
      // Only fetch the specified type if provided, otherwise fetch all
      if (!type || type === 'people') {
        peoplePromise = supabase
          .from('profiles')
          .select('*')
          .ilike('full_name', `%${searchTerm}%`)
          .or(`username.ilike.%${searchTerm}%`)
          .limit(10);
      }

      if (!type || type === 'jobs') {
        jobsPromise = supabase
          .from('job_listings')
          .select('*')
          .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
          .limit(10);
      }

      if (!type || type === 'articles') {
        articlesPromise = supabase
          .from('articles')
          .select('*, user_id, profiles!inner(*)')
          .or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
          .limit(10);
      }

      if (!type || type === 'companies') {
        companiesPromise = supabase
          .from('startups')
          .select('*')
          .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
          .limit(10);
      }

      // Execute the queries
      const [peopleResponse, jobsResponse, articlesResponse, companiesResponse] = await Promise.all([
        peoplePromise || Promise.resolve({ data: [] }),
        jobsPromise || Promise.resolve({ data: [] }),
        articlesPromise || Promise.resolve({ data: [] }),
        companiesPromise || Promise.resolve({ data: [] })
      ]);

      // Format the results based on the type
      if (type === 'people') {
        return { 
          type: 'people',
          data: peopleResponse.data?.map(person => ({
            id: person.id,
            name: person.full_name || 'Unknown User',
            username: person.username || '',
            avatar: person.avatar_url,
            headline: person.headline || 'Statusnow User',
            location: person.location || '',
            skills: person.skills || [],
            followers: person.followers_count || 0,
            following: person.following_count || 0
          })) || []
        };
      } else if (type === 'jobs') {
        return { 
          type: 'jobs', 
          data: jobsResponse.data || []
        };
      } else if (type === 'articles') {
        return { 
          type: 'articles', 
          data: articlesResponse.data?.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.summary,
            coverImage: article.cover_image,
            author: {
              id: article.profiles.id,
              name: article.profiles.full_name || 'Unknown Author',
              avatar: article.profiles.avatar_url,
              role: article.profiles.headline || 'Statusnow User'
            },
            publishedAt: article.published_at,
            readingTime: article.reading_time || '5 min',
            tags: article.tags || ['Statusnow'],
            likes: article.likes_count || 0,
            comments: article.comments_count || 0
          })) || []
        };
      } else if (type === 'companies') {
        return { 
          type: 'companies', 
          data: companiesResponse.data?.map(company => ({
            id: company.id,
            name: company.name,
            logo: company.logo,
            industry: company.category,
            location: company.location,
            size: company.size || '1-10 employees',
            description: company.description,
            founded: company.founded_year || 'Unknown'
          })) || []
        };
      }

      // Return all results if no specific type is requested
      return {
        type: 'all', // Changed from 'people' to 'all' to better reflect the content
        data: {
          people: peopleResponse.data?.map(person => ({
            id: person.id,
            name: person.full_name || 'Unknown User',
            username: person.username || '',
            avatar: person.avatar_url,
            headline: person.headline || 'Statusnow User',
            location: person.location || '',
            skills: person.skills || [],
            followers: person.followers_count || 0,
            following: person.following_count || 0
          })) || [],
          jobs: jobsResponse.data || [],
          articles: articlesResponse.data?.map(article => ({
            id: article.id,
            title: article.title,
            summary: article.summary,
            coverImage: article.cover_image,
            author: {
              id: article.profiles?.id,
              name: article.profiles?.full_name || 'Unknown Author',
              avatar: article.profiles?.avatar_url,
              role: article.profiles?.headline || 'Statusnow User'
            },
            publishedAt: article.published_at,
            readingTime: article.reading_time || '5 min',
            tags: article.tags || ['Statusnow'],
            likes: article.likes_count || 0,
            comments: article.comments_count || 0
          })) || [],
          companies: companiesResponse.data?.map(company => ({
            id: company.id,
            name: company.name,
            logo: company.logo,
            industry: company.category,
            location: company.location,
            size: company.size || '1-10 employees',
            description: company.description,
            founded: company.founded_year || 'Unknown'
          })) || []
        }
      };
    } catch (error) {
      console.error('Error searching:', error);
      return { type: type as any || 'people', data: [] };
    }
  };

  return useQuery({
    queryKey: ['search', searchTerm, type],
    queryFn: fetchSearchResults,
    enabled: !!searchTerm,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
