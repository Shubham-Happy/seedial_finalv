
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, MapPin, Calendar, Users, Building, Link as LinkIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

// Mock startup data
const STARTUP_DATA = [
  {
    id: "1",
    name: "NeoFinance",
    logo: "https://placehold.co/80?text=NF&font=roboto",
    tagline: "Next-gen financial tools for startups",
    description: "NeoFinance provides next-generation financial tools designed specifically for startups, helping founders manage their finances, fundraising, and equity more effectively. Our platform integrates with existing accounting systems and provides real-time insights into your company's financial health.",
    category: "Fintech",
    funding: "$2.4M Seed",
    location: "San Francisco, CA",
    founded: "2024",
    teamSize: "12 employees",
    website: "https://neofinance.example.com",
    founderName: "Sarah Johnson",
    founderTitle: "CEO & Co-founder",
    founderAvatar: "https://i.pravatar.cc/150?img=32"
  },
  {
    id: "2",
    name: "EcoTrack",
    logo: "https://placehold.co/80?text=ET&font=roboto",
    tagline: "Sustainability monitoring for enterprise",
    description: "EcoTrack helps enterprises monitor, measure, and reduce their environmental footprint through comprehensive sustainability tracking. Our AI-powered platform analyzes data from across your organization to identify opportunities for improvement and provides actionable recommendations to meet sustainability goals.",
    category: "CleanTech",
    funding: "$1.8M Pre-seed",
    location: "Austin, TX",
    founded: "2023",
    teamSize: "8 employees",
    website: "https://ecotrack.example.com",
    founderName: "David Patel",
    founderTitle: "CEO & Founder",
    founderAvatar: "https://i.pravatar.cc/150?img=12"
  },
  {
    id: "3",
    name: "MediConnect",
    logo: "https://placehold.co/80?text=MC&font=roboto",
    tagline: "Streamlining healthcare communication",
    description: "MediConnect is revolutionizing healthcare communication by connecting patients, providers, and insurers on a single, secure platform. Our system reduces administrative overhead, improves patient outcomes, and decreases costs through better coordination and information sharing across the healthcare ecosystem.",
    category: "HealthTech",
    funding: "$3.5M Seed",
    location: "Boston, MA",
    founded: "2022",
    teamSize: "15 employees",
    website: "https://mediconnect.example.com",
    founderName: "Maria Rodriguez",
    founderTitle: "CEO & Co-founder",
    founderAvatar: "https://i.pravatar.cc/150?img=25"
  }
];

export default function StartupDetail() {
  const { id } = useParams();
  const [startup, setStartup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const foundStartup = STARTUP_DATA.find(s => s.id === id);
      setStartup(foundStartup || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleConnect = () => {
    toast({
      title: "Connection request sent",
      description: `Your connection request to ${startup?.name} has been sent.`,
    });
  };

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="container max-w-6xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Startup Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The startup you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="mt-4">
              <Link to="/startups">Back to Startups</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden">
              <img src={startup.logo} alt={startup.name} className="w-16 h-16" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{startup.name}</h1>
              <p className="text-xl text-muted-foreground">{startup.tagline}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {startup.category}
                </span>
                <span className="text-sm bg-green-500/10 text-green-500 dark:text-green-400 px-3 py-1 rounded-full">
                  {startup.funding}
                </span>
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About {startup.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{startup.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <span>{startup.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Founded {startup.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{startup.teamSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5 text-muted-foreground" />
                  <a 
                    href={startup.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-statusnow-purple hover:underline flex items-center"
                  >
                    Website <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products & Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Information about specific products and services offered by {startup.name} will be added soon.
              </p>
              
              <div className="flex justify-center p-8 border border-dashed rounded-lg">
                <div className="text-center">
                  <Building className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <h3 className="font-medium">No products added yet</h3>
                  <p className="text-sm text-muted-foreground">
                    This startup hasn't added any products to their profile yet.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Founder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={startup.founderAvatar} alt={startup.founderName} />
                  <AvatarFallback>{startup.founderName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{startup.founderName}</p>
                  <p className="text-sm text-muted-foreground">{startup.founderTitle}</p>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col gap-3">
                <Button onClick={handleConnect} className="w-full">
                  Connect
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/messages">
                    Message
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => {
                  toast({
                    title: "Shared!",
                    description: `${startup.name} has been shared.`
                  });
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" onClick={() => {
                  toast({
                    title: "Shared!",
                    description: `${startup.name} has been shared.`
                  });
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"></path>
                  </svg>
                </Button>
                <Button variant="outline" size="icon" onClick={() => {
                  toast({
                    title: "Shared!",
                    description: `${startup.name} has been shared.`
                  });
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path>
                  </svg>
                </Button>
                <Button className="flex-1" variant="outline" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast({
                    title: "Link copied",
                    description: "The startup link has been copied to your clipboard."
                  });
                }}>
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
