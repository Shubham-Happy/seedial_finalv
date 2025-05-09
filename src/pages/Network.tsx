
import { useState } from "react";
import { User, Users, Filter, Building } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/user/ProfileCard";
import { usePeople, useFollowUser } from "@/hooks/usePeople";
import { toast } from "@/hooks/use-toast";

export default function Network() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const { people, isLoading } = usePeople();
  const { followUser, isFollowing } = useFollowUser();
  
  // Filter people based on search query
  const filteredPeople = people.filter(
    (person) =>
      person.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.headline && person.headline.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle follow action
  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error("Error following user:", error);
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again later.",
        variant: "destructive"
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-4 border-statusnow-purple border-t-transparent rounded-full mb-4"></div>
            <p className="text-muted-foreground">Loading network...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Network</h1>
          <p className="text-muted-foreground">Connect with founders, investors, and industry experts</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search people and companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64"
          />
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="people" className="mb-6" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="people">
            <User className="h-4 w-4 mr-2" />
            People
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building className="h-4 w-4 mr-2" />
            Companies
          </TabsTrigger>
        </TabsList>

        <TabsContent value="people">
          {filteredPeople.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeople.map((person) => (
                <ProfileCard 
                  key={person.id} 
                  user={person} 
                  onFollowClick={() => handleFollow(person.id)} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">No people found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try different search terms" : "Start building your network by connecting with others"}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="companies">
          <div className="text-center py-12">
            <Building className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Companies coming soon</h3>
            <p className="text-muted-foreground">
              This feature is under development and will be available soon
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
