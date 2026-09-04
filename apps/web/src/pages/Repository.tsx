import { useState, useEffect } from 'react';
import { FileText, Upload as UploadIcon, Search as SearchIcon, ExternalLink, Download, Clock, Filter, MoreHorizontal, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UploadModal } from '../components/repository/UploadModal';
import { useAuth } from '../lib/auth/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export function Repository() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      const res = await fetch('http://localhost:3000/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.data);
      } else {
        throw new Error('Fallback');
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      // Fallback for demo
      setDocuments([
        { id: '1', title: 'Urban Planning Master Plan 2025', abstract: 'Comprehensive zoning regulations for municipal expansion into agricultural transition zones.', source: 'MoHUA', created_at: new Date(Date.now() - 86400000).toISOString(), size: '4.2 MB', type: 'PDF' },
        { id: '2', title: 'Drone Survey Accuracy Report', abstract: 'Evaluation of photogrammetry vs ground surveys in tribal districts.', source: 'Survey of India', created_at: new Date(Date.now() - 172800000).toISOString(), size: '1.8 MB', type: 'PDF' },
        { id: '3', title: 'National Land Policy Draft', abstract: 'Proposed amendments for digital land titling.', source: 'DoLR', created_at: new Date(Date.now() - 259200000).toISOString(), size: '6.1 MB', type: 'DOCX' },
        { id: '4', title: 'Coastal Regulation Zone Map', abstract: 'Geospatial boundary definitions for high-tide restricted areas.', source: 'MoEFCC', created_at: new Date(Date.now() - 432000000).toISOString(), size: '12.5 MB', type: 'SHP' },
        { id: '5', title: 'Cadastral Discrepancy Case Studies', abstract: 'Analysis of 400 dispute cases resolved via blockchain mediation.', source: 'NITI Aayog', created_at: new Date(Date.now() - 604800000).toISOString(), size: '3.4 MB', type: 'PDF' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const canUpload = user?.role === 'researcher' || user?.role === 'institution' || user?.role === 'admin';

  return (
    <div className="space-y-6 max-w-[90rem] mx-auto pb-12 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 shrink-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2">Centralized Repository</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Secure storage for land governance literature, datasets, and policies.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="shadow-sm">
            <Filter className="mr-2 h-4 w-4 text-gray-500" />
            Filters
          </Button>
          {canUpload && (
            <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary/20">
              <UploadIcon className="mr-2 h-4 w-4" />
              Upload Resource
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-neutral-800 shadow-xl overflow-hidden flex flex-col flex-1">
        <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-4 bg-gray-50/50 dark:bg-neutral-900/50 shrink-0">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white" 
              placeholder="Search by title, abstract, or source..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 font-medium">
            {documents.length} documents indexed
          </div>
        </div>
        
        <div className="flex-1 overflow-auto relative">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="sticky top-0 bg-gray-50/95 dark:bg-neutral-900/95 backdrop-blur-sm text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-100 dark:border-neutral-800 z-10 shadow-sm">
              <tr>
                <th className="px-6 py-4 rounded-tl-3xl">Document Name</th>
                <th className="px-6 py-4">Source Organization</th>
                <th className="px-6 py-4">Upload Date</th>
                <th className="px-6 py-4">File Info</th>
                <th className="px-6 py-4 text-right rounded-tr-3xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading repository data...</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No documents found matching your criteria.</td>
                </tr>
              ) : (
                documents
                  .filter(doc => 
                    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    doc.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.source.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={doc.id} 
                    onClick={() => setViewDoc(doc)}
                    className="hover:bg-gray-50/80 dark:hover:bg-neutral-800/80 cursor-pointer group transition-colors"
                  >
                    <td className="px-6 py-5 min-w-[300px]">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl ${doc.type === 'PDF' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : doc.type === 'DOCX' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'bg-green-50 text-green-600 dark:bg-green-900/20'} shrink-0 group-hover:scale-110 transition-transform`}>
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="truncate">
                          <div className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">{doc.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-md mt-0.5">{doc.abstract}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300">
                        {doc.source}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(doc.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">{doc.type}</span>
                        <span className="text-xs text-gray-500 border-l pl-2 dark:border-neutral-700">{doc.size || 'Unknown size'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full" onClick={(e) => { e.stopPropagation(); alert('Downloading file...'); }}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <UploadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onUploadSuccess={fetchDocuments}
      />

      {/* Side-Drawer Document Preview */}
      <AnimatePresence>
        {viewDoc && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewDoc(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%', boxShadow: '-20px 0 25px -5px rgb(0 0 0 / 0.1)' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-neutral-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-start bg-gray-50/50 dark:bg-neutral-900/50">
                <div className="flex gap-4 items-start pr-4">
                  <div className={`p-3 rounded-2xl ${viewDoc.type === 'PDF' ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'} shrink-0 mt-1`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{viewDoc.title}</h2>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                      <span className="bg-gray-200 dark:bg-neutral-800 px-2 py-0.5 rounded text-gray-700 dark:text-gray-300">{viewDoc.source}</span>
                      <span>Uploaded {new Date(viewDoc.created_at).toLocaleDateString()}</span>
                      <span>{viewDoc.size}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setViewDoc(null)} className="p-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors shrink-0">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50 dark:bg-neutral-950">
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Abstract</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{viewDoc.abstract}</p>
                </div>
                
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm flex flex-col h-[500px] overflow-hidden">
                  <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-900/50">
                    <h3 className="font-bold text-gray-900 dark:text-white">Document Viewer</h3>
                    <Button size="sm" variant="outline" className="shadow-sm">
                      <Download className="h-4 w-4 mr-2" /> Download Source
                    </Button>
                  </div>
                  <div className="flex-1 bg-gray-100 dark:bg-neutral-800 flex items-center justify-center relative">
                    {viewDoc.url ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
                        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                          <ExternalLink className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">External Publication</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                          This is a live research paper indexed from {viewDoc.source}. Due to publisher copyright restrictions, the full PDF cannot be embedded directly.
                        </p>
                        <Button onClick={() => window.open(viewDoc.url, '_blank')} className="rounded-full shadow-lg">
                          Read on Publisher Website <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 p-8">
                        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-lg font-bold text-gray-700 dark:text-gray-300">File Preview Not Available</p>
                        <p className="text-sm mt-2 max-w-sm mx-auto">This file format ({viewDoc.type}) cannot be previewed natively in the browser. Please download it to view.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
