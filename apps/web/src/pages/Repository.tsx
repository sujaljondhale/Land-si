import { useState, useEffect } from 'react';
import { FileText, Upload as UploadIcon, Search as SearchIcon, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UploadModal } from '../components/repository/UploadModal';
import { useAuth } from '../lib/auth/AuthContext';

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
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      // Fallback for demo if API isn't running
      setDocuments([
        { id: '1', title: 'Demo Land Use Policy', abstract: 'This is a demo document...', source: 'Mock', created_at: new Date().toISOString() }
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Document Repository</h1>
          <p className="text-gray-500 dark:text-gray-400">Centralized storage for land governance literature and policies.</p>
        </div>
        {canUpload && (
          <Button onClick={() => setIsModalOpen(true)}>
            <UploadIcon className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        )}
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-xl border dark:border-neutral-800 shadow-sm">
        <div className="p-4 border-b dark:border-neutral-800 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              className="pl-9 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white" 
              placeholder="Filter documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-300 font-medium border-b dark:border-neutral-800">
              <tr>
                <th className="px-6 py-3">Document Title</th>
                <th className="px-6 py-3">Source</th>
                <th className="px-6 py-3">Date Added</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading documents...</td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No documents found.</td>
                </tr>
              ) : (
                documents
                  .filter(doc => 
                    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    doc.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    doc.source.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">{doc.title}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{doc.abstract}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{doc.source}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setViewDoc(doc)}>View</Button>
                    </td>
                  </tr>
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

      {viewDoc && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl font-bold dark:text-white">{viewDoc.title}</h2>
              <button onClick={() => setViewDoc(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl font-bold leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Source: {viewDoc.source} | Uploaded: {new Date(viewDoc.created_at).toLocaleDateString()}</p>
              <h3 className="font-semibold mb-2 dark:text-gray-200">Abstract</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">{viewDoc.abstract}</p>
              
              <h3 className="font-semibold mb-2 dark:text-gray-200">Document Preview</h3>
              <div className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded h-[500px] w-full overflow-hidden relative">
                {viewDoc.url ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-neutral-900">
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                      <ExternalLink className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">External Publication</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                      This is a live research paper indexed from {viewDoc.source}. Due to publisher copyright restrictions, the full PDF cannot be embedded directly.
                    </p>
                    <Button onClick={() => window.open(viewDoc.url, '_blank')} className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Read on Publisher Website
                    </Button>
                  </div>
                ) : (
                  <iframe 
                    src="/demo-document.pdf#toolbar=0" 
                    className="w-full h-full"
                    title="Document Preview"
                  />
                )}
              </div>
            </div>
            <div className="p-4 border-t dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900/50 flex justify-end">
              <Button onClick={() => setViewDoc(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
