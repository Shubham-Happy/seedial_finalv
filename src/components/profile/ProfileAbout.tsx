
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Mail, Users, FileText } from "lucide-react";
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

interface ProfileAboutProps {
  user: ExtendedProfile;
}

export function ProfileAbout({ user }: ProfileAboutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{user.bio}</p>

        <div className="space-y-2">
          {user.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
          )}

          {user.website && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <LinkIcon className="h-4 w-4" />
              <a href={user.website.startsWith("http") ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {user.website}
              </a>
            </div>
          )}

          {user.email && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <div>
              <span className="font-medium">{user.followers}</span>
              <span className="ml-1 text-muted-foreground">Followers</span>
            </div>
            <div>
              <span className="font-medium">{user.following}</span>
              <span className="ml-1 text-muted-foreground">Following</span>
            </div>
            <div>
              <span className="font-medium">{user.articles}</span>
              <span className="ml-1 text-muted-foreground">Articles</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
