
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary?: string;
  type: string;
  posted: string;
  tags: string[];
  description: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidate: {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    resume?: string;
    linkedIn?: string;
  };
  coverLetter?: string;
  status: string; // 'new', 'reviewing', 'interviewing', 'offered', 'rejected'
  submittedDate: string;
  notes?: string;
}

export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Load current user ID
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user.id || null);
    };
    getUser();
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select('*')
          .order('posted', { ascending: false });
        
        if (error) throw error;
        
        // Format job data
        const formattedJobs: Job[] = data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          companyLogo: job.company_logo || undefined,
          location: job.location,
          salary: job.salary || undefined,
          type: job.type,
          posted: formatTimeAgo(new Date(job.posted)),
          tags: job.tags,
          description: job.description
        }));
        
        setJobs(formattedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load job listings.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
    
    // Subscribe to job changes
    const channel = supabase
      .channel('jobs-changes')
      .on('postgres_changes', 
        { 
          event: '*',  
          schema: 'public',
          table: 'job_listings'
        },
        () => fetchJobs()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch applications for current user
  useEffect(() => {
    if (!currentUserId) return;
    
    const fetchApplications = async () => {
      try {
        const { data, error } = await supabase
          .from('job_applications')
          .select(`
            *,
            job:job_id(
              title,
              company
            )
          `)
          .order('submitted_date', { ascending: false });
        
        if (error) throw error;
        
        // Format application data
        const formattedApplications: JobApplication[] = data.map(app => ({
          id: app.id,
          jobId: app.job_id,
          candidate: {
            name: app.candidate_name || '',
            email: app.candidate_email || '',
            phone: app.candidate_phone,
            resume: app.resume,
            linkedIn: app.candidate_linkedin
          },
          coverLetter: app.cover_letter,
          status: app.status,
          submittedDate: app.submitted_date,
          notes: app.notes
        }));
        
        setApplications(formattedApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    
    fetchApplications();
    
    // Subscribe to application changes
    const channel = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { 
          event: '*',  
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${currentUserId}`
        },
        () => fetchApplications()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  // Apply for a job
  const applyForJob = async (
    jobId: string,
    candidateName: string,
    candidateEmail: string,
    candidatePhone: string,
    candidateLinkedIn: string,
    coverLetter: string,
    resume: string
  ) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to apply for jobs.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('job_applications')
        .insert({
          job_id: jobId,
          user_id: currentUserId,
          candidate_name: candidateName,
          candidate_email: candidateEmail,
          candidate_phone: candidatePhone,
          candidate_linkedin: candidateLinkedIn,
          cover_letter: coverLetter,
          resume: resume,
          status: 'new',
          submitted_date: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Application submitted!",
        description: "Your job application has been successfully submitted.",
      });
      
      return true;
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post a new job
  const postJob = async (jobData: Omit<Job, 'id' | 'posted'>) => {
    if (!currentUserId) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to post jobs.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique ID for the job
      const jobId = `job_${Date.now()}`;
      
      const { error } = await supabase
        .from('job_listings')
        .insert({
          id: jobId,
          title: jobData.title,
          company: jobData.company,
          company_logo: jobData.companyLogo,
          location: jobData.location,
          salary: jobData.salary,
          type: jobData.type,
          tags: jobData.tags,
          description: jobData.description,
          user_id: currentUserId,
          posted: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({
        title: "Job posted successfully!",
        description: "Your job posting is now live on the job board.",
      });
      
      return true;
    } catch (error) {
      console.error("Error posting job:", error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (appId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', appId);
      
      if (error) throw error;
      
      toast({
        title: "Application status updated",
        description: `Application has been marked as ${newStatus}.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating application status:", error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    
    return "Just now";
  };

  return {
    jobs,
    applications,
    isLoading,
    isSubmitting,
    applyForJob,
    postJob,
    updateApplicationStatus
  };
};
