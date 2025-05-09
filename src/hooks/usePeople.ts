
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPeople, followUser } from '@/lib/supabase-people-queries';
import { toast } from "@/hooks/use-toast";

export const usePeople = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['people'],
    queryFn: fetchPeople,
  });
  
  return {
    people: data || [],
    isLoading,
    error,
  };
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: followUser,
    onSuccess: () => {
      // Invalidate and refetch people data after a successful follow/unfollow
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to follow",
        description: "An error occurred while following this user.",
        variant: "destructive",
      });
      console.error("Follow error:", error);
    }
  });
  
  return {
    followUser: mutate,
    isFollowing: isPending,
  };
};
