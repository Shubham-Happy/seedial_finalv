
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Briefcase, Building, MapPin, Clock, ArrowLeft, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SocialShare } from "@/components/sharing/SocialShare";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { useJobs } from "@/hooks/useJobs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const { jobs, isLoading, applyForJob } = useJobs();
  const [job, setJob] = useState<any>(null);
  const [jobLoading, setJobLoading] = useState(true);
  
  // Form state
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [candidateLinkedIn, setCandidateLinkedIn] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Try to find the job in the jobs list first
    const jobFromList = jobs.find(job => job.id === id);
    
    if (jobFromList) {
      setJob(jobFromList);
      setJobLoading(false);
      return;
    }
    
    // If not found or jobs not loaded yet, fetch directly from Supabase
    const fetchJob = async () => {
      setJobLoading(true);
      try {
        const { data, error } = await supabase
          .from('job_listings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Format job data
          setJob({
            id: data.id,
            title: data.title,
            company: data.company,
            companyLogo: data.company_logo || undefined,
            location: data.location,
            salary: data.salary || undefined,
            type: data.type,
            posted: formatTimeAgo(new Date(data.posted)),
            tags: data.tags,
            description: data.description
          });
        }
      } catch (error) {
        console.error("Error fetching job:", error);
        toast({
          title: "Error",
          description: "Failed to load job details.",
          variant: "destructive"
        });
      } finally {
        setJobLoading(false);
      }
    };
    
    fetchJob();
  }, [id, jobs]);

  // Prefill form with user data if available
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user.id) {
        // Get profile data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setCandidateName(data.full_name || '');
          setCandidateEmail(session.user.email || '');
        }
      }
    };
    
    fetchUserData();
  }, []);
  
  // Format time ago function
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

  // Handle apply form submission
  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !candidateName || !candidateEmail) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to apply for jobs.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Upload resume to storage if provided
      let resumeUrl = '';
      if (resumeFile) {
        const fileExt = resumeFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('resumes')
          .upload(filePath, resumeFile);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = supabase.storage
          .from('resumes')
          .getPublicUrl(filePath);
          
        resumeUrl = urlData.publicUrl;
      }
      
      // Apply for job
      const success = await applyForJob(
        id,
        candidateName,
        candidateEmail,
        candidatePhone,
        candidateLinkedIn,
        coverLetter,
        resumeUrl
      );
      
      if (success) {
        setIsApplyDialogOpen(false);
        setCoverLetter("");
        setResumeFile(null);
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (jobLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link to="/jobs">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Jobs
            </Link>
          </Button>
        </div>
        
        <div className="bg-card border rounded-lg overflow-hidden mb-8">
          {/* Job Header Skeleton */}
          <div className="p-6 border-b">
            <div className="flex items-start gap-6">
              <Skeleton className="w-16 h-16 rounded-lg" />
              
              <div className="flex-1">
                <Skeleton className="h-8 w-2/3 mb-2" />
                <Skeleton className="h-6 w-1/3 mb-4" />
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-40" />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-24 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-28 rounded-full" />
                </div>
              </div>
              
              <div>
                <Skeleton className="h-10 w-32 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
          </div>
          
          {/* Job Description Skeleton */}
          <div className="p-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            
            <Skeleton className="h-6 w-40 mt-8 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            <Skeleton className="h-6 w-32 mt-8 mb-4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If job not found, display not found message
  if (!job) {
    return (
      <div className="container max-w-3xl mx-auto py-16 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Job Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The job posting you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/jobs">Browse All Jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link to="/jobs">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Jobs
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg overflow-hidden mb-8">
        {/* Job Header */}
        <div className="p-6 border-b">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
              {job.companyLogo ? (
                <img 
                  src={job.companyLogo} 
                  alt={`${job.company} logo`} 
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Building className="h-8 w-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">{job.title}</h1>
              <p className="text-lg mb-3">{job.company}</p>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <span>{job.salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted {job.posted}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 border-primary/20">
                  {job.type}
                </Badge>
                {job.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2 flex-col items-end">
              <Button onClick={() => setIsApplyDialogOpen(true)}>
                Apply Now
              </Button>
              <SocialShare
                url={`/jobs/${job.id}`}
                title={`${job.title} at ${job.company}`}
                description={`Check out this job opportunity: ${job.title} at ${job.company}`}
              />
            </div>
          </div>
        </div>
        
        {/* Job Description */}
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Job Description</h2>
          <div className="prose max-w-none">
            <p className="mb-4">
              {job.description}
            </p>
            
            {/* Extended job description - in a real app, this would come from the complete job listing */}
            <h3 className="text-lg font-medium mt-6 mb-2">Responsibilities</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Design and implement new features and functionality for our web application</li>
              <li>Collaborate with designers, product managers, and other engineers</li>
              <li>Write clean, maintainable, and efficient code</li>
              <li>Troubleshoot and debug applications</li>
              <li>Participate in code reviews and help maintain code quality</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Requirements</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>3+ years of experience in {job.tags[0]} development</li>
              <li>Strong understanding of {job.tags.join(', ')}</li>
              <li>Experience with version control systems, preferably Git</li>
              <li>Excellent problem-solving abilities</li>
              <li>Strong communication skills and ability to work in a team</li>
            </ul>
            
            <h3 className="text-lg font-medium mt-6 mb-2">Benefits</h3>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Competitive salary and equity package</li>
              <li>Flexible work hours and remote work options</li>
              <li>Health, dental, and vision insurance</li>
              <li>401(k) plan with company match</li>
              <li>Professional development budget</li>
              <li>Unlimited PTO</li>
            </ul>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">About {job.company}</h3>
            <p className="mb-4">
              {job.company} is an innovative company in the {job.tags[job.tags.length - 1]} space, 
              dedicated to creating cutting-edge solutions that solve real-world problems.
              We're a team of passionate individuals who value creativity, collaboration, and continuous learning.
            </p>
          </div>
          
          <div className="mt-8 pt-4 flex justify-center">
            <Button size="lg" onClick={() => setIsApplyDialogOpen(true)}>
              Apply for this Position
            </Button>
          </div>
        </div>
      </div>
      
      {/* Apply Dialog */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Submit your application for the {job.title} position at {job.company}.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleApply} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Smith" 
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  required 
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  placeholder="+1 (555) 123-4567" 
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input 
                  id="linkedin" 
                  placeholder="https://linkedin.com/in/johnsmith" 
                  value={candidateLinkedIn}
                  onChange={(e) => setCandidateLinkedIn(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume">Resume/CV</Label>
              <Input 
                id="resume" 
                type="file" 
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                accept=".pdf,.doc,.docx" 
                required
              />
              <p className="text-xs text-muted-foreground">
                Upload your resume in PDF, DOC, or DOCX format (max 5MB).
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea 
                id="coverLetter" 
                placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsApplyDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>Submitting...</>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Application
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
