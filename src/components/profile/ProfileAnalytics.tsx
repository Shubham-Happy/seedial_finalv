
import { useEffect, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { 
  Card, CardContent, CardDescription, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

// Mock analytics data
const profileViewsData = [
  { name: 'Jan', views: 65 },
  { name: 'Feb', views: 78 },
  { name: 'Mar', views: 92 },
  { name: 'Apr', views: 85 },
  { name: 'May', views: 105 },
  { name: 'Jun', views: 120 },
  { name: 'Jul', views: 132 },
];

const articlePerformanceData = [
  { name: '10 Steps to Launch Your Startup', views: 245, likes: 124, comments: 32 },
  { name: 'Building a Remote-First Culture', views: 186, likes: 98, comments: 15 },
  { name: 'Fundraising Strategies for 2025', views: 210, likes: 87, comments: 24 },
  { name: 'Product-Market Fit Guide', views: 164, likes: 76, comments: 18 },
];

const audienceData = [
  { name: 'Entrepreneurs', value: 45 },
  { name: 'Investors', value: 20 },
  { name: 'Developers', value: 15 },
  { name: 'Marketers', value: 12 },
  { name: 'Others', value: 8 },
];

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

export function ProfileAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle>Profile Analytics</CardTitle>
        <CardDescription>
          Track your profile performance and audience engagement
        </CardDescription>
      </CardHeader>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent>
          <TabsContent value="overview" className="mt-0 space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-4">Profile Views</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ChartContainer 
                  config={{
                    views: {
                      label: "Profile Views",
                      theme: {
                        light: "#8B5CF6",
                        dark: "#9b87f5"
                      }
                    }
                  }}
                >
                  <BarChart data={profileViewsData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" name="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">493</CardTitle>
                  <CardDescription>Total Profile Views</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">32%</CardTitle>
                  <CardDescription>Profile Growth</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">87</CardTitle>
                  <CardDescription>Connection Requests</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="content" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-sm font-medium mb-4">Article Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Article</th>
                      <th className="text-right py-3 px-4">Views</th>
                      <th className="text-right py-3 px-4">Likes</th>
                      <th className="text-right py-3 px-4">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articlePerformanceData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/20">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="text-right py-3 px-4">{item.views}</td>
                        <td className="text-right py-3 px-4">{item.likes}</td>
                        <td className="text-right py-3 px-4">{item.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="mt-0">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/2">
                <h3 className="text-sm font-medium mb-4">Audience Breakdown</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-sm font-medium mb-2">Audience Insights</h3>
                <ul className="space-y-3">
                  {audienceData.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 mt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Your profile is most popular among entrepreneurs and investors, 
                    indicating your content resonates with startup founders and potential
                    funding partners.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
