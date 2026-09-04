import { useState } from 'react';
import { Bell, Menu, FileText, AlertTriangle, Moon, Sun, Search } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';
import { useTheme } from '../../lib/theme/ThemeContext';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'document',
      title: 'New Policy Draft Uploaded',
      desc: 'Urban Planning 2025 workspace was updated by Admin.',
      time: '10 minutes ago'
    },
    {
      id: 2,
      type: 'alert',
      title: 'High-Priority Dispute',
      desc: 'A new land dispute was flagged in Sector 4 zone.',
      time: '1 hour ago'
    }
  ]);

  const toggleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const handleClearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  return (
    <header className="h-16 border-b bg-white dark:bg-neutral-900 dark:border-neutral-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 relative z-50 transition-colors print:hidden">
      <div className="flex items-center space-x-4">
        <button className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Animated Search Bar */}
        <motion.div 
          layout
          className="relative group hidden sm:block w-48 focus-within:w-80"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors duration-300" />
          </div>
          <input
            type="text"
            placeholder="Search documents, disputes..."
            className="block w-full transition-all duration-300 ease-out pl-10 pr-3 py-2 border border-gray-200 dark:border-neutral-700 rounded-full leading-5 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-white dark:focus:bg-neutral-900 sm:text-sm shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 z-10">
            <kbd className="inline-flex items-center border border-gray-200 dark:border-neutral-700 rounded px-2 text-xs font-sans font-medium text-gray-400 dark:text-gray-500">
              ⌘K
            </kbd>
          </div>
        </motion.div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
          title={`Current theme: ${theme}`}
        >
          {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
        
        <div className="relative">
          <button 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-neutral-900">
                {notifications.length}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-neutral-800 rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-700 overflow-hidden z-50 origin-top-right"
              >
                <div className="p-4 border-b dark:border-neutral-700 bg-gray-50/80 dark:bg-neutral-900/50 flex justify-between items-center backdrop-blur-md">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                  <span className="text-xs font-bold bg-primary/10 dark:bg-primary/20 text-primary px-2.5 py-1 rounded-full">{notifications.length}</span>
                </div>
                <div className="divide-y dark:divide-neutral-700 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-gray-50 dark:hover:bg-neutral-700/50 cursor-pointer flex gap-3 transition-colors">
                        <div className={`p-2.5 rounded-xl h-min ${notif.type === 'alert' ? 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-primary/10 dark:bg-primary/20 text-primary'}`}>
                          {notif.type === 'alert' ? <AlertTriangle className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">{notif.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{notif.desc}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 font-medium">{notif.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t dark:border-neutral-700 text-center bg-gray-50/80 dark:bg-neutral-900/50 backdrop-blur-md">
                    <button 
                      className="text-xs text-primary font-medium hover:underline"
                      onClick={handleClearNotifications}
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center space-x-2 border-l dark:border-neutral-700 pl-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
            {user?.name}
          </span>
          <Button variant="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
