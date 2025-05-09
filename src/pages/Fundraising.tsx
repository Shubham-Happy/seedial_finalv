import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Award, Filter, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fetchFundraisingEvents, createFundraisingEvent, FundraisingEvent } from "@/lib/supabase-fundraising-queries";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().min(1, "Category is required"),
  deadline: z.string().min(1, "Application deadline is required"),
  prize: z.string().min(1, "Prize information is required"),
  organizer: z.string().min(1, "Organizer name is required"),
});

export default function Fundraising() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Fetch fundraising events
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["fundraising-events"],
    queryFn: fetchFundraisingEvents,
  });

  // Filter events based on search query and category filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) || event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === "all" || event.category.toLowerCase() === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Setup form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      date: "",
      location: "",
      category: "Competition",
      deadline: "",
      prize: "",
      organizer: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create a fundraising event.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFundraisingEvent(values, imageFile);
      setDialogOpen(false);
      form.reset();
      setImageFile(null);
      refetch();
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto">
      <section className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold">Fundraising & Competitions</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64"
            />
            <Button variant="outline" size="icon">
              <Filter size={18} />
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="default">
                  <Plus size={16} className="mr-2" />
                  Host an Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create a Fundraising Event</DialogTitle>
                  <DialogDescription>
                    Share fundraising opportunities with the community. All events will be reviewed before publishing.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Startup Pitch Competition" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} placeholder="Describe your event, requirements, and benefits" rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Date</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. May 15, 2025" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. San Francisco, CA" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                {...field}
                              >
                                <option value="Competition">Competition</option>
                                <option value="Pitch Event">Pitch Event</option>
                                <option value="Grant">Grant</option>
                                <option value="Accelerator">Accelerator</option>
                                <option value="Hackathon">Hackathon</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Application Deadline</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. April 1, 2025" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="prize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prize/Funding Amount</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. $100,000 investment" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organizer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizer</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. TechStars" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Label htmlFor="event-image">Event Image (Optional)</Label>
                      <Input id="event-image" type="file" accept="image/*" onChange={handleImageChange} />
                      {imageFile && <p className="text-sm text-muted-foreground mt-1">Selected: {imageFile.name}</p>}
                    </div>
                    <DialogFooter>
                      <Button type="submit">Create Event</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-statusnow-purple/5 rounded-lg p-4 mb-6 border border-statusnow-purple/20">
          <div className="flex items-center gap-3">
            <Award className="h-10 w-10 text-statusnow-purple" />
            <div>
              <h2 className="text-lg font-medium">Monthly Funding Challenge</h2>
              <p className="text-sm text-muted-foreground">The top 3 most-voted startups each month will be reviewed by our panel of investors for potential funding.</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full mb-6">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter("all")}>
              All
            </TabsTrigger>
            <TabsTrigger value="competition" onClick={() => setFilter("competition")}>
              Competitions
            </TabsTrigger>
            <TabsTrigger value="pitch event" onClick={() => setFilter("pitch event")}>
              Pitch Events
            </TabsTrigger>
            <TabsTrigger value="grant" onClick={() => setFilter("grant")}>
              Grants
            </TabsTrigger>
            <TabsTrigger value="accelerator" onClick={() => setFilter("accelerator")}>
              Accelerators
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="space-y-2">
                    <div className="h-5 bg-muted rounded w-4/5 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/5 animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded animate-pulse" />
                </CardContent>
                <CardFooter>
                  <div className="h-4 bg-muted rounded w-full animate-pulse" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={event.image || `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}`}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <Calendar size={14} /> {event.date}
                        </CardDescription>
                      </div>
                      <span className="text-xs bg-statusnow-purple/10 text-statusnow-purple px-2 py-1 rounded-full">{event.category}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                    <div className="mt-3 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Location:</span> {event.location}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Application Deadline:</span> {event.deadline}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Prize:</span> {event.prize}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">By {event.organizer}</p>
                    <Link
                      to={`/fundraising/${event.id}`}
                      className="flex items-center text-sm text-statusnow-purple hover:text-statusnow-purple-dark"
                    >
                      View Details <ChevronRight size={16} />
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <Award className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
