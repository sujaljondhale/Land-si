import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function DownloadButton({ onClick, className }: { onClick?: () => void, className?: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleClick = () => {
    if (status !== 'idle') return;
    setStatus('loading');
    
    // Simulate download
    setTimeout(() => {
      setStatus('success');
      if (onClick) onClick();
      
      // Reset
      setTimeout(() => setStatus('idle'), 2500);
    }, 1200);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleClick}
      className={cn(
        "relative flex h-11 w-40 items-center justify-center overflow-hidden rounded-xl font-semibold shadow-sm border transition-colors",
        status === 'idle' ? "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary" :
        status === 'loading' ? "bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 text-gray-500" :
        "bg-primary border-primary text-white shadow-primary/20",
        className
      )}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div
            key="idle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </motion.div>
        )}
        
        {status === 'loading' && (
          <motion.div
            key="loading"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Preparing...</span>
          </motion.div>
        )}
        
        {status === 'success' && (
          <motion.div
            key="success"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            <span>Saved!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
