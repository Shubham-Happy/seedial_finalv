
import { useState } from "react";
import { Search as SearchIcon, Filter, Users, Briefcase, FileText, Building, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileCard } from "@/components/user/ProfileCard";
import { JobCard } from "@/components/jobs/JobCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { useSearch } from "@/hooks/useSearch";
import { toast } from "@/hooks/use-toast";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("people");
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: searchResults, isLoading, error } = useSearch(isSearching ? searchTerm : "", activeTab);
  
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (isSearching) {
      // Re-search with the new tab value
      setIsSearching(true);
    }
  };

  if (error) {
    toast({
      title: "Search Error",
      description: "Failed to perform search. Please try again later.",
      variant: "destructive"
    });
  }

  const renderResults = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mb-4" />
          <p className="ml-2 text-muted-foreground">Searching...</p>
        </div>
      );
    }
    
    if (!searchResults || !searchResults.data || 
        (Array.isArray(searchResults.data) && searchResults.data.length === 0) ||
        (!Array.isArray(searchResults.data) && Object.values(searchResults.data).every(arr => arr.length === 0))) {
      return (
        <div className="text-center py-12">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground">
            We couldn't find any {activeTab} matching "{searchTerm}"
          </p>
        </div>
      );
    }
    
    switch (activeTab) {
      case "people":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(searchResults.data) ? 
              searchResults.data.map((person) => (
                <ProfileCard key={person.id} user={person} compact={true} />
              )) : 
              searchResults.data.people.map((person) => (
                <ProfileCard key={person.id} user={person} compact={true} />
              ))
            }
          </div>
        );
      case "jobs":
        return (
          <div className="space-y-6">
            {Array.isArray(searchResults.data) ? 
              searchResults.data.map((job) => (
                <JobCard key={job.id} job={job} />
              )) : 
              searchResults.data.jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            }
          </div>
        );
      case "articles":
        return (
          <div className="space-y-6">
            {Array.isArray(searchResults.data) ? 
              searchResults.data.map((article) => (
                <ArticleCard key={article.id} article={article} />
              )) : 
              searchResults.data.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))
            }
          </div>
        );
      case "companies":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.isArray(searchResults.data) ? 
              searchResults.data.map((company) => (
                <div key={company.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-full w-full object-cover rounded-md" />
                      ) : (
                        <Building className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="mb-1">{company.location} • Founded {company.founded}</p>
                    <p className="mb-1">{company.size}</p>
                    <p className="mt-2">{company.description}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm">Follow</Button>
                  </div>
                </div>
              )) : 
              searchResults.data.companies.map((company) => (
                <div key={company.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                      {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-full w-full object-cover rounded-md" />
                      ) : (
                        <Building className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{company.name}</h3>
                      <p className="text-sm text-muted-foreground">{company.industry}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="mb-1">{company.location} • Founded {company.founded}</p>
                    <p className="mb-1">{company.size}</p>
                    <p className="mt-2">{company.description}</p>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">View Profile</Button>
                    <Button size="sm">Follow</Button>
                  </div>
                </div>
              ))
            }
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search people, jobs, articles, and more..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {isSearching && (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
              Search results for "{searchTerm}"
            </h2>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <Tabs defaultValue="people" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="mb-6">
              <TabsTrigger value="people">
                <Users className="h-4 w-4 mr-2" />
                People
              </TabsTrigger>
              <TabsTrigger value="jobs">
                <Briefcase className="h-4 w-4 mr-2" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="articles">
                <FileText className="h-4 w-4 mr-2" />
                Articles
              </TabsTrigger>
              <TabsTrigger value="companies">
                <Building className="h-4 w-4 mr-2" />
                Companies
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="focus:outline-none">
              {renderResults()}
            </TabsContent>
          </Tabs>
        </>
      )}

      {!isSearching && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Search Statusnow</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Find people, jobs, articles, companies and more on the platform.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="outline" onClick={() => {
              setSearchTerm("entrepreneurship");
              setIsSearching(true);
            }}>
              Entrepreneurship
            </Button>
            <Button variant="outline" onClick={() => {
              setSearchTerm("startup funding");
              setIsSearching(true);
            }}>
              Startup Funding
            </Button>
            <Button variant="outline" onClick={() => {
              setSearchTerm("product management");
              setIsSearching(true);
            }}>
              Product Management
            </Button>
            <Button variant="outline" onClick={() => {
              setSearchTerm("tech jobs");
              setIsSearching(true);
            }}>
              Tech Jobs
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
