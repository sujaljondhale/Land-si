import { Link } from 'react-router-dom';
import { Home, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function Error404() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4 font-sans">
      <div className="w-full max-w-lg text-center space-y-8">
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-100 dark:bg-red-900/20 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
          <div className="relative bg-red-50 dark:bg-red-900/40 text-red-500 rounded-full p-6 shadow-xl border border-red-100 dark:border-red-800">
            <ShieldAlert size={48} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-6xl font-extrabold tracking-tighter text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
            Page not found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            The page you're looking for doesn't exist, has been moved, or you don't have the required permissions to access it.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto h-11 px-6 rounded-xl border-gray-200 dark:border-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all font-medium"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Link to="/" className="w-full sm:w-auto">
            <Button className="w-full h-11 px-6 rounded-xl bg-primary hover:bg-[#1f5c0e] text-white shadow-lg shadow-primary/20 transition-all font-medium">
              <Home className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
        </div>
        
        <div className="pt-8 text-sm text-gray-400 dark:text-gray-500">
          Error code: ERR_NOT_FOUND
        </div>
      </div>
    </div>
  );
}
