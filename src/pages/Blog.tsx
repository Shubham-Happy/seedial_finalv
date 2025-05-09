
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Validate Your Startup Idea in 5 Steps",
      excerpt: "Learn the essential steps to validate your startup idea before investing time and resources.",
      author: "Sarah Johnson",
      date: "May 5, 2025",
      readTime: "5 min read",
      category: "Startup Validation",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=2070"
    },
    {
      id: 2,
      title: "The Ultimate Guide to Startup Funding",
      excerpt: "Everything you need to know about securing funding for your startup at different stages.",
      author: "Michael Chen",
      date: "May 3, 2025",
      readTime: "8 min read",
      category: "Funding",
      image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2070"
    },
    {
      id: 3,
      title: "Building a Minimum Viable Product That Actually Works",
      excerpt: "Strategies for creating an MVP that serves as a strong foundation for your product.",
      author: "Alex Rivera",
      date: "April 29, 2025",
      readTime: "6 min read",
      category: "Product Development",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070"
    },
    {
      id: 4,
      title: "How to Build a Startup Culture That Attracts Top Talent",
      excerpt: "Creating a company culture that helps you recruit and retain the best team members.",
      author: "Priya Patel",
      date: "April 25, 2025",
      readTime: "7 min read",
      category: "Team Building",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070"
    }
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Blog</h1>
        <p className="text-muted-foreground">
          Insights, tips and strategies for founders and startup enthusiasts
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="aspect-video w-full overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <span className="font-medium text-primary">{post.category}</span>
              </div>
              <CardTitle className="line-clamp-2">{post.title}</CardTitle>
              <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link to={`/blog/${post.id}`}>
                  Read Article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button variant="outline">Load More Articles</Button>
      </div>
    </div>
  );
}
