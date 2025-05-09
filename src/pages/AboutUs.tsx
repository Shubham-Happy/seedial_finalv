
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rocket, Target, Lightbulb, Users, Award, Building } from "lucide-react";

export default function AboutUs() {
  const team = [
    {
      name: "Shubham Shrivastav",
      role: "Founder & CEO",
      // bio: "Serial entrepreneur with 15+ years of experience in tech startups. Previously founded and sold two successful SaaS companies.",
      // image: "https://i.pravatar.cc/150?u=sarah"
    },
    {
      name: "Nayan Aggarwal",
      role: "Co-founder & CMO",
      // bio: "Former engineering leader at Google. Built and scaled multiple tech products with millions of users worldwide.",
      // image: "https://i.pravatar.cc/150?u=michael"
    },
    // {
    //   name: "Priya Patel",
    //   role: "Chief Marketing Officer",
    //   bio: "Growth marketing expert who has helped 50+ startups achieve product-market fit and scale their user acquisition.",
    //   image: "https://i.pravatar.cc/150?u=priya"
    // },
    // {
    //   name: "David Williams",
    //   role: "Chief Operating Officer",
    //   bio: "Operations specialist with experience scaling organizations from 10 to 500+ employees across multiple markets.",
    //   image: "https://i.pravatar.cc/150?u=david"
    // }
  ];

  const values = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Innovation",
      description: "We constantly push boundaries and explore new approaches to solve founder challenges."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Community",
      description: "We believe in the power of connection and creating meaningful relationships among founders."
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Impact",
      description: "We measure our success by the positive impact we make on founders and their startups."
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Knowledge Sharing",
      description: "We're committed to democratizing access to startup expertise and insights."
    }
  ];

  return (
    <div className="container max-w-6xl py-8">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Seedial</h1>
        <p className="text-xl text-muted-foreground">
          Building the platform where startup founders connect, learn, and grow together
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-6">
            At Seedial, we're on a mission to empower the next generation of founders by providing them with the tools, resources, and connections they need to turn their ideas into successful ventures.
          </p>
          <p className="text-muted-foreground">
            We believe that entrepreneurship has the power to solve the world's biggest problems, and we're committed to making the startup journey more accessible, collaborative, and successful for everyone.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070" 
            alt="Team working"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center">
              <CardHeader>
                <div className="mx-auto rounded-full p-3 bg-primary/10 text-primary w-16 h-16 flex items-center justify-center mb-4">
                  {value.icon}
                </div>
                <CardTitle>{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Our Story</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-4">
            <div className="rounded-full p-3 bg-primary/10 text-primary w-16 h-16 flex items-center justify-center">
              <Lightbulb className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">The Idea</h3>
            <p className="text-muted-foreground">
              Seedial was born from our founder's personal experience with the challenges of building a startup. Too many great ideas fail not because of the concept, but because founders lacked the right resources and connections at critical moments.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-full p-3 bg-primary/10 text-primary w-16 h-16 flex items-center justify-center">
              <Building className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">The Journey</h3>
            <p className="text-muted-foreground">
              We launched just now in 2025 with a simple platform connecting founders to mentors. Now, we see forward to increase our community with you.
                 </p>
          </div>
          
          <div className="space-y-4">
            <div className="rounded-full p-3 bg-primary/10 text-primary w-16 h-16 flex items-center justify-center">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Today</h3>
            <p className="text-muted-foreground">
              Today, Seedial is just a start of something new but with efforts from all of us we can surely build something great.
              
            </p>
          </div>
        </div>
      </div>
      
      <div>
        {/* <h2 className="text-2xl font-bold mb-8 text-center">Our Team</h2> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
          {/* {team.map((member, index) => ( */}
            {/* // <Card key={index}> */}
            {/* //   <CardHeader className="text-center"> */}
            {/* //     {/* <Avatar className="h-24 w-24 mx-auto mb-4"> */}
            {/* //       <AvatarImage src={member.image} alt={member.name} /> */}
            {/* //       <AvatarFallback>{member.name.charAt(0)}</AvatarFallback> */}
            {/* //     </Avatar> */} 
            {/* //     <CardTitle>{member.name}</CardTitle> */}
            {/* //     <CardDescription>{member.role}</CardDescription> */}
            {/* //   </CardHeader> */}
            {/* //   <CardContent> */}
            {/* //     <p className="text-center text-muted-foreground"> */}
            {/* //       {member.bio} */}
            {/* //     </p> */}
            {/* //   </CardContent> */}
            {/* // </Card> */}
          {/* ))} */}
        {/* </div> */}
      </div>
    </div>
  );
}
