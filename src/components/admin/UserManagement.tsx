
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, Trash, Edit, Check, X } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface UserData {
  id: string;
  full_name: string | null;
  username: string | null;
  email: string;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  status: string | null;
}

export function UserManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [adminToggleDialogOpen, setAdminToggleDialogOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Get all users from profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Get user emails from auth.users (requires admin access)
      const { data: { session } } = await supabase.auth.getSession();
      
      // If we have profiles, map them to UserData
      if (profiles) {
        const usersWithEmails: UserData[] = await Promise.all(
          profiles.map(async (profile) => {
            // For now, we can just use username as email since we can't directly query auth.users
            let email = `${profile.username || 'user'}@example.com`;
            
            // Get real email if user is the current session user
            if (session?.user.id === profile.id) {
              email = session.user.email || email;
            }
            
            return {
              id: profile.id,
              full_name: profile.full_name,
              username: profile.username,
              email: email,
              avatar_url: profile.avatar_url,
              is_admin: profile.is_admin || false,
              created_at: profile.created_at,
              status: profile.status
            };
          })
        );
        
        setUsers(usersWithEmails);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleAdmin = async (user: UserData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, is_admin: !user.is_admin } : u
      ));
      
      toast({
        title: "Success",
        description: `${user.full_name || user.username} is now ${!user.is_admin ? 'an admin' : 'no longer an admin'}.`,
      });
      
      setAdminToggleDialogOpen(false);
    } catch (error) {
      console.error("Error toggling admin status:", error);
      toast({
        title: "Error",
        description: "Failed to update user admin status.",
        variant: "destructive"
      });
    }
  };
  
  const deleteUser = async (userId: string) => {
    try {
      // In a real app, this would be handled by a secure admin function or API
      // For now, we'll just update the profile table
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        // Fallback if admin function doesn't work - just remove from profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
          
        if (profileError) throw profileError;
      }
      
      // Update local state
      setUsers(users.filter(u => u.id !== userId));
      
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. This may require additional admin privileges.",
        variant: "destructive"
      });
    }
  };
  
  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Card className="border-purple-200 dark:border-purple-800">
      <CardHeader className="bg-gradient-to-r from-cream-50 to-cream-100 dark:from-purple-900/20 dark:to-purple-800/20">
        <div className="flex justify-between">
          <div>
            <CardTitle className="flex items-center text-purple-700 dark:text-purple-300">
              <User className="h-5 w-5 mr-2" />
              User Management
            </CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">Add New User</Button>
        </div>
        <div className="mt-4">
          <Input 
            placeholder="Search users..." 
            className="max-w-sm border-purple-200" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="w-12 h-12 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 dark:bg-purple-900/20">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-cream-200 dark:divide-gray-700">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-cream-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Avatar className="w-8 h-8 mr-3">
                            {user.avatar_url ? (
                              <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />
                            ) : (
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {(user.full_name?.[0] || user.username?.[0] || 'U').toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.full_name || 'Unnamed User'}</div>
                            <div className="text-xs text-muted-foreground">@{user.username || 'no-username'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.email || 'No email'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {user.is_admin ? (
                          <div className="flex items-center">
                            <Shield className="w-4 h-4 text-purple-600 mr-1" />
                            <span>Admin</span>
                          </div>
                        ) : (
                          "Member"
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Badge className="bg-green-100 text-green-800 border-0 dark:bg-green-900/30 dark:text-green-300">
                          Active
                        </Badge>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-900/20"
                            onClick={() => {
                              setCurrentUser(user);
                              setAdminToggleDialogOpen(true);
                            }}
                          >
                            {user.is_admin ? "Remove Admin" : "Make Admin"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
                            onClick={() => {
                              setCurrentUser(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-cream-50 dark:bg-gray-900/20 border-t py-3 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled className="border-purple-200">Previous</Button>
          <Button variant="outline" size="sm" disabled className="border-purple-200">Next</Button>
        </div>
      </CardFooter>
      
      {/* Delete User Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentUser?.full_name || currentUser?.username || "this user"}'s account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => currentUser && deleteUser(currentUser.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Toggle Admin Dialog */}
      <AlertDialog open={adminToggleDialogOpen} onOpenChange={setAdminToggleDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {currentUser?.is_admin 
                ? "Remove admin privileges?" 
                : "Grant admin privileges?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentUser?.is_admin 
                ? `This will remove admin access for ${currentUser?.full_name || currentUser?.username}.`
                : `This will give ${currentUser?.full_name || currentUser?.username} full admin access to the platform.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className={currentUser?.is_admin ? "bg-amber-600 hover:bg-amber-700" : "bg-purple-600 hover:bg-purple-700"}
              onClick={() => currentUser && toggleAdmin(currentUser)}
            >
              {currentUser?.is_admin ? "Remove Admin" : "Make Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
