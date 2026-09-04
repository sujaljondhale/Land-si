import { Map, LayoutDashboard, Search, FileText, Settings, User, Folder, Activity, MapPin, Lightbulb } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth/AuthContext';

export function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['researcher', 'institution', 'policymaker', 'admin', 'public'] },
    { label: 'Map Explorer', icon: Map, href: '/map', roles: ['researcher', 'institution', 'policymaker', 'public'] },
    { label: 'Repository', icon: FileText, href: '/repository', roles: ['researcher', 'institution', 'admin'] },
    { label: 'AI Search', icon: Search, href: '/search', roles: ['researcher', 'institution', 'policymaker', 'public'] },
    { label: 'Workspaces', icon: Folder, href: '/workspace', roles: ['researcher', 'institution'] },
    { label: 'Simulator', icon: Activity, href: '/simulator', roles: ['policymaker', 'admin'] },
    { label: 'Grievances', icon: MapPin, href: '/grievance', roles: ['public'] },
    { label: 'Dispute Inbox', icon: MapPin, href: '/inbox', roles: ['policymaker', 'admin'] },
    { label: 'Innovation', icon: Lightbulb, href: '/innovation', roles: ['researcher', 'institution', 'public'] },
    { label: 'Admin', icon: Settings, href: '#', roles: ['admin'] },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r dark:border-neutral-800 flex-shrink-0 hidden md:flex flex-col transition-colors">
      <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-neutral-800">
        <h1 className="font-bold text-[#2A7C13] dark:text-[#76C457] text-lg truncate">LandGov Platform</h1>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems
            .filter(item => user && item.roles.includes(user.role))
            .map((item, i) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={i}
                  to={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-[#FFF8CF] dark:bg-[#2A7C13]/20 text-[#2A7C13] dark:text-[#76C457]" 
                      : "text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-neutral-800/50 hover:text-gray-900 dark:hover:text-gray-200"
                  )}
                >
                  <item.icon className={cn("mr-3 h-5 w-5 transition-colors", isActive ? "text-[#2A7C13] dark:text-[#76C457]" : "text-gray-400 dark:text-gray-500")} />
                  {item.label}
                </Link>
              );
            })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="bg-[#76C457] dark:bg-[#2A7C13] text-white rounded-full p-2">
            <User className="h-4 w-4" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name || 'Guest'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">{user?.role || 'Public'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
