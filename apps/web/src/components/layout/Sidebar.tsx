import { Map, LayoutDashboard, Search, FileText, Settings, User, Folder, Activity, MapPin, Lightbulb } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth/AuthContext';
import { motion } from 'framer-motion';

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
    <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-gray-100 dark:border-neutral-800 flex-shrink-0 hidden md:flex flex-col transition-colors print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none z-10">
      <div className="h-20 flex items-center px-8 border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Map className="w-4 h-4 text-primary" />
          </div>
          <h1 className="font-extrabold text-gray-900 dark:text-white tracking-tight text-lg truncate">Land-si</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1.5 px-4">
          {navItems
            .filter(item => user && item.roles.includes(user.role))
            .map((item, i) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="relative flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-colors group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35
                      }}
                    />
                  )}
                  <item.icon 
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors relative z-10", 
                      isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300"
                    )} 
                  />
                  <span className={cn(
                    "relative z-10 transition-colors",
                    isActive ? "text-primary font-bold" : "text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200"
                  )}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-100 dark:border-neutral-800 m-4 rounded-2xl bg-gray-50 dark:bg-neutral-800/50 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer">
        <Link to="/profile" className="flex items-center w-full">
          <div className="bg-primary/10 text-primary rounded-xl p-2.5 flex-shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="ml-3 truncate">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{user?.name || 'Guest'}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Public'}</p>
          </div>
        </Link>
      </div>
    </aside>
  );
}
