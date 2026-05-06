import { Users, ArrowRightLeft, Wallet, TrendingUp } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const volumeData = [
  { date: "Day 1", volume: 200 },
  { date: "Day 2", volume: 300 },
  { date: "Day 3", volume: 250 },
  { date: "Day 4", volume: 400 },
  { date: "Day 5", volume: 350 },
  { date: "Day 6", volume: 500 },
  { date: "Day 7", volume: 450 },
];

const growthData = [
  { month: "Week 1", users: 40 },
  { month: "Week 2", users: 60 },
  { month: "Week 3", users: 45 },
  { month: "Week 4", users: 80 },
  { month: "Week 5", users: 110 },
];

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
  users: {
    label: "Users",
    color: "hsl(var(--primary-foreground))",
  }
};

export function DashboardPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
        <p className="text-muted-foreground mt-2">
          Real-time performance metrics and system health indicators.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold">842,129</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ArrowRightLeft className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Transactions</p>
                <p className="text-3xl font-bold">1.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Wallet className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Transferred Amount</p>
                <p className="text-3xl font-bold">$42.8M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Users (Daily)</p>
                <p className="text-3xl font-bold">94,204</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Main Chart */}
        <Card className="md:col-span-5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div className="space-y-1">
              <CardTitle>Transaction Volume Over Time</CardTitle>
              <CardDescription>Aggregated global volume across all corridors</CardDescription>
            </div>
            <Tabs defaultValue="30d">
              <TabsList>
                <TabsTrigger value="7d">7D</TabsTrigger>
                <TabsTrigger value="30d">30D</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={volumeData}>
                    <defs>
                      <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="volume"
                      stroke="hsl(var(--primary))"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorVolume)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Side Chart */}
        <Card className="md:col-span-2 shadow-sm bg-primary text-primary-foreground border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-primary-foreground">User Growth</CardTitle>
            <CardDescription className="text-primary-foreground/80">New registrations this quarter</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-[300px]">
            <div className="mt-8">
              <p className="text-5xl font-bold">+24.8%</p>
              <p className="text-xs font-medium text-primary-foreground/80 mt-2 tracking-wider">TARGET: +20.0%</p>
            </div>
            
            <div className="h-[120px] mt-auto">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={growthData}>
                    <ChartTooltip content={<ChartTooltipContent />} cursor={{fill: 'rgba(255,255,255,0.1)'}} />
                    <Bar 
                      dataKey="users" 
                      fill="currentColor" 
                      radius={[4, 4, 0, 0]} 
                      className="fill-primary-foreground/90"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
