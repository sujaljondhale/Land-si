import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, FileText, AlertTriangle, CheckCircle2, BookOpen, Share2, Download, Clock, MapPin, ShieldAlert, Activity, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAuth } from '../lib/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { useTheme } from '../lib/theme/ThemeContext';

const COLORS = ['#2A7C13', '#76C457', '#FBE6C2', '#e5e7eb'];

export function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
        const res = await fetch('http://localhost:3000/analytics/indicators', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json.data);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Failed to fetch analytics');
      }
      
      // Fallback data if API fails or user is unauthenticated
      setData({
        totalDocuments: 12450,
        activeDisputes: 842,
        resolvedDisputes: 3105,
        landUseDistribution: [
          { name: 'Agricultural', value: 45 },
          { name: 'Urban', value: 30 },
          { name: 'Forest', value: 15 },
          { name: 'Water Bodies', value: 10 }
        ],
        monthlyTrends: [
          { month: 'Jan', disputes: 120, policies: 5 },
          { month: 'Feb', disputes: 150, policies: 2 },
          { month: 'Mar', disputes: 110, policies: 8 },
          { month: 'Apr', disputes: 90, policies: 4 }
        ]
      });
      setIsLoading(false);
    };
    fetchAnalytics();
  }, []);

  if (isLoading || !data) {
    return <div className="animate-pulse space-y-6">
      <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-1/4"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
        <div className="h-80 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
      </div>
    </div>;
  }

  // Choose the dashboard layout based on role
  if (user?.role === 'public') {
    return <PublicDashboard />;
  }
  
  if (user?.role === 'researcher' || user?.role === 'institution') {
    return <ResearchDashboard />;
  }

  // Default to Admin/Policymaker Dashboard
  return <AdminDashboard data={data} user={user} />;
}

// --- Specific Dashboards ---

function AdminDashboard({ data, user }: { data: any, user: any }) {
  const { theme } = useTheme();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Analytics Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role} Dashboard</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#2A7C13] hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]" onClick={() => window.location.href = '/repository'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Documents</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">{data.totalDocuments.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-[#FFF8CF] dark:bg-[#2A7C13]/20 rounded-full"><FileText className="h-6 w-6 text-[#2A7C13]" /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]" onClick={() => window.location.href = '/inbox'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Disputes</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">{data.activeDisputes.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-500/20 rounded-full"><AlertTriangle className="h-6 w-6 text-red-500" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#76C457] hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]" onClick={() => window.location.href = '/repository'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">{data.resolvedDisputes.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-500/20 rounded-full"><CheckCircle2 className="h-6 w-6 text-[#76C457]" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]" onClick={() => window.location.href = '/workspace'}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">4,201</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-full"><Users className="h-6 w-6 text-blue-500" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e5e7eb'} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#6b7280'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: theme === 'dark' ? '#94a3b8' : '#6b7280'}} />
                  <Tooltip cursor={{ fill: theme === 'dark' ? '#334155' : '#f3f4f6' }} contentStyle={{backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px'}} />
                  <Bar dataKey="disputes" name="Disputes" fill="#2A7C13" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="policies" name="New Policies" fill="#FBE6C2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Land Use Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.landUseDistribution}
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.landUseDistribution.map((_entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{backgroundColor: theme === 'dark' ? '#1e293b' : '#fff', border: 'none', borderRadius: '8px'}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              {data.landUseDistribution.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center text-xs dark:text-gray-300">
                  <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  {entry.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ResearchDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Research & Academia</h1>
          <p className="text-gray-500 dark:text-gray-400">Welcome to your academic portal</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#2A7C13]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">My Publications</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">12</h3>
              </div>
              <div className="p-3 bg-[#FFF8CF] dark:bg-[#2A7C13]/20 rounded-full"><BookOpen className="h-6 w-6 text-[#2A7C13]" /></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Collaborations</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">4</h3>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/20 rounded-full"><Share2 className="h-6 w-6 text-blue-500" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#76C457]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Datasets Accessed</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">48</h3>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-500/20 rounded-full"><Download className="h-6 w-6 text-[#76C457]" /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Peer Reviews</p>
                <h3 className="text-3xl font-bold mt-1 text-gray-900 dark:text-gray-100">2</h3>
              </div>
              <div className="p-3 bg-yellow-50 dark:bg-yellow-500/20 rounded-full"><Clock className="h-6 w-6 text-yellow-500" /></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-lg">
                  <Activity className="h-5 w-5 text-[#2A7C13] dark:text-[#76C457] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Draft updated in 'Urban Expansion Study' workspace</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">By Dr. Sharma • 2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={() => window.location.href = '/workspace'}>Go to Workspaces</Button>
          </CardContent>
        </Card>

        <Card className="bg-[#2A7C13] dark:bg-[#1f5c0e] text-white border-none">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full space-y-4">
            <BookOpen className="h-16 w-16 text-[#FFF8CF]" />
            <h3 className="text-2xl font-bold">Need Data?</h3>
            <p className="text-[#FFF8CF] max-w-sm">Use our AI search to query millions of indexed land records and GIS datasets for your research.</p>
            <Button className="bg-[#FFF8CF] text-[#2A7C13] hover:bg-white dark:hover:bg-gray-200 mt-4" onClick={() => window.location.href = '/search'}>
              Open AI Search
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PublicDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Citizen Portal</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage your grievances and local alerts</p>
        </div>
        <Button onClick={() => window.print()} variant="outline" className="print:hidden">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-t-4 border-t-red-500 hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-4 bg-red-50 dark:bg-red-500/20 rounded-full"><ShieldAlert className="h-8 w-8 text-red-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Report an Issue</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">File a grievance regarding illegal construction or encroachment.</p>
            <Button className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white" onClick={() => window.location.href = '/grievance'}>File Grievance</Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-[#2A7C13] hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-4 bg-green-50 dark:bg-green-500/20 rounded-full"><MapPin className="h-8 w-8 text-[#2A7C13]" /></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Neighborhood</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View active land disputes and zoning changes near you.</p>
            <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = '/map'}>Open Map</Button>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-blue-500 hover:-translate-y-1 transition-transform">
          <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
            <div className="p-4 bg-blue-50 dark:bg-blue-500/20 rounded-full"><Search className="h-8 w-8 text-blue-500" /></div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Public Records</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Search government policies and public property records.</p>
            <Button variant="outline" className="w-full mt-2" onClick={() => window.location.href = '/search'}>Search Records</Button>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>My Grievances Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border dark:border-neutral-800 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800">
              <thead className="bg-gray-50 dark:bg-neutral-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-800">
                <tr className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">#GRV-9281</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Encroachment</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-500 border border-yellow-200 dark:border-yellow-700/50">In Review</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2 days ago</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
