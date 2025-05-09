
import { useState } from "react";
import { Star, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState<"general" | "feature" | "bug">("general");
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    }, 1000);
  };

  const handleRatingClick = (value: number) => {
    setRating(value);
  };

  if (submitted) {
    return (
      <div className="container max-w-2xl mx-auto py-12 text-center">
        <div className="bg-muted/30 p-12 rounded-lg">
          <ThumbsUp className="h-16 w-16 text-statusnow-purple mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-lg mb-8">
            Your feedback has been submitted successfully. We appreciate your input and will use it to improve Statusnow.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="/dashboard">Return to Dashboard</a>
            </Button>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Submit Another Response
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Your Feedback Matters</h1>
        <p className="text-muted-foreground mt-2">
          Help us improve Statusnow by sharing your thoughts and suggestions.
        </p>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Submit Feedback</CardTitle>
          <CardDescription>
            Your feedback directly influences our product roadmap.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Feedback Type</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  type="button"
                  variant={feedbackType === "general" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFeedbackType("general")}
                >
                  General Feedback
                </Button>
                <Button 
                  type="button"
                  variant={feedbackType === "feature" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFeedbackType("feature")}
                >
                  Feature Request
                </Button>
                <Button 
                  type="button"
                  variant={feedbackType === "bug" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setFeedbackType("bug")}
                >
                  Report a Bug
                </Button>
              </div>
            </div>

            {(feedbackType === "general" || feedbackType === "feature") && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">How would you rate your experience?</h3>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRatingClick(value)}
                      className="p-1 transition-colors"
                    >
                      <Star 
                        className={cn(
                          "h-8 w-8",
                          rating && rating >= value
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        )} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-sm font-medium">
                {feedbackType === "general"
                  ? "Share your thoughts"
                  : feedbackType === "feature"
                  ? "Describe the feature you'd like to see"
                  : "Describe the issue you're experiencing"}
              </h3>
              <Textarea
                placeholder={
                  feedbackType === "general"
                    ? "Tell us about your experience with Statusnow..."
                    : feedbackType === "feature"
                    ? "Describe the feature you'd like us to add..."
                    : "What went wrong? Please provide steps to reproduce the issue..."
                }
                className="min-h-[120px]"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Email (optional)</h3>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                We'll only use this to follow up on your feedback if necessary.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="ghost" type="button" onClick={() => {
              setFeedback("");
              setEmail("");
              setRating(null);
            }}>
              Reset
            </Button>
            <Button type="submit" disabled={!feedback.trim() || isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="animate-pulse mr-2">Submitting</span>
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" /> Submit Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join our Community</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Connect with other Statusnow users to share ideas, get help, and
              collaborate on projects.
            </p>
            <Button className="w-full" variant="outline" onClick={() => toast({
              title: "Community access",
              description: "You'll be redirected to our community forum soon!",
            })}>
              Join Community
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Suggest New Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Have an idea for a new feature? Submit it to our public roadmap
              and vote on other suggestions.
            </p>
            <Button className="w-full" variant="outline" onClick={() => {
              setFeedbackType("feature");
              window.scrollTo({
                top: 0,
                behavior: "smooth"
              });
              toast({
                title: "Feature suggestion",
                description: "Thanks for helping us improve Statusnow!",
              });
            }}>
              Suggest Feature
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
