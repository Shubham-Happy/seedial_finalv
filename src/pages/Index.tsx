import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Briefcase, 
  FileText, 
  Users, 
  ArrowDown, 
  Rocket, 
  Trophy, 
  Building, 
  HeartHandshake,
  PieChart,
  Lightbulb,
  Target,
  CheckCircle,
  ExternalLink
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set dark theme as default
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    
    // Scroll reveal animation
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);
    
    document.querySelectorAll('.reveal').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light flex items-center justify-center">
              <Rocket className="h-4 w-4 text-white" />
            </div> */}
            <span className="font-bold  text-xl bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light bg-clip-text">
              Seedial
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {/* <Link to="/blog" className="text-sm hover:text-statusnow-purple transition">Blog</Link> */}
            <Link to="/help-center" className="text-sm hover:text-statusnow-purple transition">Help Center</Link>
            {/* <Link to="/community" className="text-sm hover:text-statusnow-purple transition">Community</Link> */}
            <Link to="/startup-guide" className="text-sm hover:text-statusnow-purple transition">Startup Guide</Link>
            <div className="relative group">
              <span className="text-sm cursor-pointer hover:text-statusnow-purple transition">Company</span>
              <div className="absolute left-0 top-full mt-2 bg-popover border border-border rounded-md shadow-lg p-2 w-40 hidden group-hover:block">
                <Link to="/about-us" className="block px-3 py-2 text-sm hover:bg-muted rounded-md">About Us</Link>
                {/* <Link to="/careers" className="block px-3 py-2 text-sm hover:bg-muted rounded-md">Careers</Link> */}
                <Link to="/privacy-policy" className="block px-3 py-2 text-sm hover:bg-muted rounded-md">Privacy Policy</Link>
                <Link to="/terms-of-service" className="block px-3 py-2 text-sm hover:bg-muted rounded-md">Terms of Service</Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-32 relative overflow-hidden">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal fade-in-left">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/80   bg-clip-text">
                Where Startups Ideas Thrive Together
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
                Connect, showcase, and launch your startup on the platform built for founders by founders.
                Join our community of innovators and entrepreneurs, where you can discuss over your ideas , get feedback, and collaborate with like-minded individuals.
              </p>
              <div className="flex flex-col gap-4">
                <Button size="lg" className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white" asChild>
                  <Link to="/register">
                    Join Seedial
                     <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                {/* <Button size="lg" variant="outline" asChild>
                  <Link to="/register">
                    Explore Startup Guide
                  </Link>
                </Button> */}
              </div>
              <div className="flex items-center gap-2 mt-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light border-2 border-background flex items-center justify-center">
                      <span className="text-white font-semibold text-xs">
                        {String.fromCharCode(64 + i)}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  Join founders community on Seedial
                </span>
              </div>
            </div>
            
            <div className="reveal fade-in-right">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-statusnow-purple/20 to-statusnow-purple-light/20 rounded-3xl blur-3xl"></div>
                
                <img 
                  src="public\image.png" 
                  alt="Startup founders collaborating" 
                  className="rounded-3xl bg-white w-full h-auto object-cover relative z-10 border border-white/10"
                />
                <img 
                  src="public\logo.png" 
                  alt="Startup founders collaborating" 
                  className="rounded-3xl bg-white w-full h-auto object-cover relative z-10 border border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute top-20 right-0 w-64 h-64 bg-statusnow-purple/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-statusnow-purple-light/20 rounded-full filter blur-3xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 reveal fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Transform Your Startup Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to discuss ideas, showcase your startup, and launch your products to an engaged community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-xl reveal fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Lightbulb className="h-6 w-6 text-statusnow-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Discuss Ideas</h3>
              <p className="text-muted-foreground mb-6">
                Connect with like-minded entrepreneurs, brainstorm concepts, and receive valuable feedback from experienced founders.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Dedicated discussion forums</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Private messaging</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Expert-led AMAs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-xl reveal fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Building className="h-6 w-6 text-statusnow-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Showcase Your Startup</h3>
              <p className="text-muted-foreground mb-6">
                Create a compelling profile for your startup, highlight your products, and get discovered by investors and partners.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Customizable startup profiles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Product showcases</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Investor discovery tools</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-xl reveal fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Rocket className="h-6 w-6 text-statusnow-purple" />
              </div>
              <h3 className="text-xl font-bold mb-3">Launch Products</h3>
              <p className="text-muted-foreground mb-6">
                Announce and launch your products to an engaged audience of early adopters, fellow founders, and potential customers.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Launch announcements</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Feedback collection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Early user acquisition</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 md:py-32 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="reveal fade-in-left">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-statusnow-purple/20 to-statusnow-purple-light/20 rounded-3xl blur-3xl"></div>
                <img 
                  src="public\d2eau0ubdmvhgpxd7qfj.png" 
                  alt="Startup community" 
                  className="rounded-3xl w-full h-auto object-cover relative z-10 border border-white/10"
                />
              </div>
            </div>
            
            <div className="reveal fade-in-right">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join a Thriving Community of Innovators</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Connect with fellow founders, mentors, investors, and industry experts all focused on building the next generation of successful startups.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-statusnow-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Network with Purpose</h3>
                    <p className="text-muted-foreground">
                      Build meaningful connections with the right people who can help your startup succeed.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <HeartHandshake className="h-6 w-6 text-statusnow-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Mentorship & Support</h3>
                    <p className="text-muted-foreground">
                      Learn from experienced entrepreneurs who've been there before and are willing to guide you.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-statusnow-purple" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Resources & Opportunities</h3>
                    <p className="text-muted-foreground">
                      Access funding opportunities, partnership possibilities, and resources to help you grow.
                    </p>
                  </div>
                </div>
              </div>
              
              <Button className="mt-8" size="lg" onClick={() => navigate("/register")}>
                Join Our Community <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Startups Section */}
      {/* <section className="py-20 md:py-32 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 reveal fade-in-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Featured Startups</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover innovative startups built and launched with Seedial
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "NeoFinance",
                logo: "https://placehold.co/80?text=NF&font=roboto",
                tagline: "Next-gen financial tools for startups",
                category: "Fintech",
                funding: "$2.4M Seed"
              },
              {
                name: "EcoTrack",
                logo: "https://placehold.co/80?text=ET&font=roboto",
                tagline: "Sustainability monitoring for enterprise",
                category: "CleanTech",
                funding: "$1.8M Pre-seed"
              },
              {
                name: "MediConnect",
                logo: "https://placehold.co/80?text=MC&font=roboto",
                tagline: "Streamlining healthcare communication",
                category: "HealthTech",
                funding: "$3.5M Seed"
              }
            ].map((startup, index) => (
              <div 
                key={index}
                className="bg-card/40 backdrop-blur-sm border border-border p-6 rounded-xl reveal fade-in-up transition-all hover:scale-105"
                style={{animationDelay: `${0.1 * index}s`}}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-lg bg-muted/50 flex items-center justify-center">
                    <img src={startup.logo} alt={startup.name} className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{startup.name}</h3>
                    <p className="text-sm text-muted-foreground">{startup.category}</p>
                  </div>
                </div>
                <p className="mb-4">{startup.tagline}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {startup.funding}
                  </span>
                  <Button variant="ghost" size="sm" className="text-statusnow-purple">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 reveal fade-in-up">
            <Button size="lg" variant="outline" onClick={() => navigate("/startups")}>
              Explore All Startups <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
         */}
        {/* Background elements */}
        {/* <div className="absolute top-40 left-0 w-72 h-72 bg-statusnow-purple/10 rounded-full filter blur-3xl"></div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="bg-gradient-to-r from-statusnow-purple/20 to-statusnow-purple-light/20 backdrop-blur-lg border border-white/10 rounded-3xl p-8 md:p-12 reveal fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Take Your Startup to the Next Level?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join the platform where startup founders connect, share ideas, and grow together.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light text-white" onClick={() => navigate("/register")}>
                Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              {/* <Button size="lg" variant="outline" onClick={() => navigate("/startup-guide")}>
                Learn More
              </Button> */}
            </div>
          </div>
        </div>
        
        {/* Background elements */}
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-statusnow-purple-light/20 rounded-full filter blur-3xl"></div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/10 border-t border-border py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 lg:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light flex items-center justify-center">
                  <Rocket className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-xl bg-gradient-to-r from-statusnow-purple to-statusnow-purple-light   bg-clip-text">
                  Seedial
                </span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">
                The platform where startup founders connect, share ideas, and grow together.
              </p>
              <div className="flex gap-4">
                {/* <a href="#" className="text-muted-foreground hover:text-foreground transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" className="text-muted-foreground hover:text-foreground transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </a> */}
                <a href="https://www.linkedin.com/company/satusin" className="text-muted-foreground hover:text-foreground transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-sm text-muted-foreground hover:text-foreground transition">Features</Link></li>
                <li><Link to="/startups" className="text-sm text-muted-foreground hover:text-foreground transition">Startups</Link></li>
                <li><Link to="/fundraising" className="text-sm text-muted-foreground hover:text-foreground transition">Fundraising</Link></li>
                <li><Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground transition">Jobs</Link></li>
              </ul>
            </div> */}
            
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                {/* <li><Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition">Blog</Link></li> */}
                <li><Link to="/help-center" className="text-sm text-muted-foreground hover:text-foreground transition">Help Center</Link></li>
                {/* <li><Link to="/community" className="text-sm text-muted-foreground hover:text-foreground transition">Community</Link></li> */}
                <li><Link to="/startup-guide" className="text-sm text-muted-foreground hover:text-foreground transition">Startup Guide</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link to="/about-us" className="text-sm text-muted-foreground hover:text-foreground transition">About Us</Link></li>
                {/* <li><Link to="/careers" className="text-sm text-muted-foreground hover:text-foreground transition">Careers</Link></li> */}
                <li><Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy Policy</Link></li>
                <li><Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition">Terms of Service</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">Email: ceo@connect.seedial.site</li>
                <li className="text-sm text-muted-foreground">India</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {new Date().getFullYear()} Seedial. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition">Privacy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition">Terms</Link>
              <Link to="/help-center" className="text-sm text-muted-foreground hover:text-foreground transition">Support</Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add animation classes */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
          }
          .fade-in-left {
            transform: translateX(-30px);
          }
          .fade-in-right {
            transform: translateX(30px);
          }
          .fade-in-up {
            transform: translateY(30px);
          }
          .animate-in {
            opacity: 1;
            transform: translate(0);
          }
        `
      }} />
    </div>
  );
}
