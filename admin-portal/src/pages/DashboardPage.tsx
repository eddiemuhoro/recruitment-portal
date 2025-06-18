import { useEffect, useState, useCallback } from 'react';
import { agencyAnalyticsApi } from '../api/agencyAnalytics';
import type { DashboardData, RevenueData } from '../api/agencyAnalytics';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const MetricCard = ({ title, value, trend, description }: { title: string; value: number; trend?: number; description?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <Badge variant={trend > 0 ? "success" : "destructive"}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const agencyId = 1; // TODO: Get from auth context
      const [dashboard, revenue] = await Promise.all([
        agencyAnalyticsApi.getDashboard(agencyId),
        agencyAnalyticsApi.getRevenue(agencyId),
      ]);
      setDashboardData(dashboard);
      setRevenueData(revenue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [fetchData, autoRefresh]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={fetchData} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="flex items-center justify-center h-screen">No data available</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Agency Dashboard</h1>
        <div className="flex gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setAutoRefresh(!autoRefresh)}>
            {autoRefresh ? 'Disable Auto-refresh' : 'Enable Auto-refresh'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Active Jobs"
              value={dashboardData.active_jobs}
              trend={12}
              description="Currently active job postings"
            />
            <MetricCard
              title="Recent Applications"
              value={dashboardData.recent_applications}
              trend={-5}
              description="Applications in the last 7 days"
            />
            <MetricCard
              title="Recent Inquiries"
              value={dashboardData.recent_inquiries}
              trend={8}
              description="New inquiries this week"
            />
            <MetricCard
              title="Urgent Inquiries"
              value={dashboardData.urgent_inquiries}
              trend={-2}
              description="Requiring immediate attention"
            />
          </div>

          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Response Rate</h4>
                  <Progress value={85} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">85% of inquiries responded to within 24h</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Job Fill Rate</h4>
                  <Progress value={72} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">72% of jobs filled within 30 days</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Client Satisfaction</h4>
                  <Progress value={94} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">94% client satisfaction rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Posting Trends</CardTitle>
                <CardDescription>Job posting activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboardData.job_trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Status Distribution</CardTitle>
                <CardDescription>Current status of all applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData.application_status}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {dashboardData.application_status.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Additional analytics content */}
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analytics</CardTitle>
              <CardDescription>In-depth analysis of agency performance</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add more detailed analytics here */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance metrics content */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators and benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add performance metrics here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 