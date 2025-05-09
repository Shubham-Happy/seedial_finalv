
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar, FileText, Briefcase, BookOpen, Users } from "lucide-react";
import { ProfileAnalytics } from "@/components/profile/ProfileAnalytics";
import { Profile as ProfileType } from "@/types/database";

interface ExtendedProfile extends ProfileType {
  bio?: string;
  location?: string;
  website?: string;
  email?: string;
  followers?: number;
  following?: number;
  articles?: number;
  skills?: string[];
  experience?: any[];
  education?: any[];
  certifications?: any[];
  coverImage?: string;
}

interface ProfileTabsProps {
  user: ExtendedProfile;
  isOwnProfile: boolean;
  articles: any[];
  isLoadingArticles: boolean;
}

export function ProfileTabs({ user, isOwnProfile, articles, isLoadingArticles }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState("posts");
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short" }).format(date);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs defaultValue="posts" onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start space-x-2 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="posts"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="articles"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Articles
            </TabsTrigger>
            <TabsTrigger
              value="experience"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Experience
            </TabsTrigger>
            {/* <TabsTrigger
              value="education"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Education
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Analytics
            </TabsTrigger> */}
          </TabsList>

          <div className="mt-6">
            {/* Tabs Content */}
            <TabsContent value="posts">
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No posts yet</h3>
                <p className="text-muted-foreground">
                  {isOwnProfile
                    ? "Share your thoughts with the community!"
                    : `${user.full_name || user.username || 'User'} hasn't posted anything yet.`}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="articles" className="space-y-6">
              {isLoadingArticles ? (
                <p className="text-muted-foreground">Loading articles...</p>
              ) : articles.length > 0 ? (
                articles.map((article) => <div key={article.id}>Article card placeholder</div>)
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No articles yet</h3>
                  <p className="text-muted-foreground">
                    {isOwnProfile
                      ? "Share your knowledge and insights by writing your first article!"
                      : `${user.full_name || user.username || 'User'} hasn't published any articles yet.`}
                  </p>
                  {isOwnProfile && (
                    <Button className="mt-4" asChild>
                      <Link to="/articles/new">Write an Article</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="experience">
              <div className="space-y-6">
                {user.experience && user.experience.length > 0 ? (
                  user.experience.map((exp: any) => (
                    <div key={exp.id} className="p-5 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {exp.logo ? (
                            <img src={exp.logo} alt={exp.company} className="h-full w-full object-cover" />
                          ) : (
                            <Briefcase className="h-full w-full p-2 text-muted-foreground" />
                          )}
                        </div>

                        <div className="flex-grow">
                          <h3 className="text-lg font-medium">{exp.title}</h3>
                          <p className="text-base">{exp.company}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                          </p>
                          <p className="text-sm mt-3">{exp.description}</p>

                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium mb-2">Key Achievements:</h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {exp.achievements.map((achievement: string, i: number) => (
                                  <li key={i} className="text-sm">{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No experience listed</h3>
                    {isOwnProfile && (
                      <>
                        <p className="text-muted-foreground">Add your professional experience to complete your profile.</p>
                        <Button className="mt-4" asChild>
                          <Link to="/settings/experience">Add Experience</Link>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="education">
              <div className="space-y-6">
                {user.education && user.education.length > 0 ? (
                  user.education.map((edu: any) => (
                    <div key={edu.id} className="p-5 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          {edu.logo ? (
                            <img src={edu.logo} alt={edu.school} className="h-full w-full object-cover" />
                          ) : (
                            <BookOpen className="h-full w-full p-2 text-muted-foreground" />
                          )}
                        </div>

                        <div>
                          <h3 className="text-lg font-medium">{edu.school}</h3>
                          <p className="text-base">{edu.degree}</p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startYear} - {edu.endYear}
                          </p>

                          {edu.description && <p className="text-sm mt-3">{edu.description}</p>}

                          {edu.activities && (
                            <p className="text-sm mt-2">
                              <span className="font-medium">Activities:</span> {edu.activities}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No education listed</h3>
                    {isOwnProfile && (
                      <>
                        <p className="text-muted-foreground">Add your educational background to complete your profile.</p>
                        <Button className="mt-4" asChild>
                          <Link to="/settings/education">Add Education</Link>
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              {isOwnProfile ? (
                <ProfileAnalytics />
              ) : (
                <div className="text-center py-12">
                  <ChartBar className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Analytics are private</h3>
                  <p className="text-muted-foreground">Profile analytics are only visible to the profile owner</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
