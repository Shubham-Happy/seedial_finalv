
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface FundraisingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  deadline: string;
  prize: string;
  organizer: string;
  image?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const fetchFundraisingEvents = async (): Promise<FundraisingEvent[]> => {
  try {
    const { data: events, error } = await supabase
      .from('funding_events')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching fundraising events:", error);
      throw error;
    }
    
    return events;
  } catch (error) {
    console.error("Error in fetchFundraisingEvents:", error);
    return [];
  }
};

export const createFundraisingEvent = async (eventData: Partial<FundraisingEvent>, imageFile?: File): Promise<FundraisingEvent | null> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an event.",
        variant: "destructive",
      });
      return null;
    }

    // Upload image if provided
    let imageUrl;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('event_images')
        .upload(filePath, imageFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('event_images')
        .getPublicUrl(filePath);

      imageUrl = urlData.publicUrl;
    }

    // Make sure required fields are present
    const requiredFields = ['title', 'description', 'date', 'location', 'category', 'deadline', 'prize', 'organizer'];
    for (const field of requiredFields) {
      if (!eventData[field as keyof typeof eventData]) {
        toast({
          title: "Missing information",
          description: `Please provide the ${field}.`,
          variant: "destructive",
        });
        return null;
      }
    }

    // Insert event data
    const { data, error } = await supabase
      .from('funding_events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        location: eventData.location,
        category: eventData.category,
        deadline: eventData.deadline,
        prize: eventData.prize,
        organizer: eventData.organizer,
        image: imageUrl,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    toast({
      title: "Event created",
      description: "Your fundraising event has been successfully added.",
    });
    
    return data;
  } catch (error) {
    console.error("Error creating fundraising event:", error);
    
    toast({
      title: "Error",
      description: "Failed to create fundraising event. Please try again.",
      variant: "destructive",
    });
    
    return null;
  }
};
