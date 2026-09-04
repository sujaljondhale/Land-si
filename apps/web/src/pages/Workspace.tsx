import { useState, useEffect } from 'react';
import { Folder, Users, FileText, Plus, Search, MoreVertical, LayoutGrid, List, X, MousePointer2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadModal } from '../components/repository/UploadModal';

const MOCK_COLLABORATORS = [
  { name: 'Dr. Ramesh Singh', email: 'ramesh.singh@gov.in', role: 'Admin', avatar: 'bg-blue-500' },
  { name: 'Priya Sharma', email: 'psharma@niti.gov.in', role: 'Editor', avatar: 'bg-green-500' },
  { name: 'Amit Patel', email: 'apatel@survey.gov.in', role: 'Editor', avatar: 'bg-yellow-500' },
  { name: 'Sunita Devi', email: 'sunita.d@revenue.gov.in', role: 'Viewer', avatar: 'bg-purple-500' },
  { name: 'Dr. K. R. Rao', email: 'krrao@iit.ac.in', role: 'Viewer', avatar: 'bg-red-500' },
  { name: 'Sanjay Kumar', email: 'skumar@mohua.gov.in', role: 'Viewer', avatar: 'bg-indigo-500' }
];

export function Workspace() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWs, setSelectedWs] = useState<any>(null);
  const [viewDoc, setViewDoc] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
        const res = await fetch('http://localhost:3000/workspace', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setWorkspaces(json.data);
        } else {
          throw new Error('Fallback');
        }
      } catch (error) {
        console.error('Failed to fetch workspaces');
        setWorkspaces([
          { id: '1', title: 'Urban Planning 2025', role: 'admin', documentCount: 14, collaborators: 5, color: 'bg-blue-500' },
          { id: '2', title: 'Tribal Land Disputes Review', role: 'editor', documentCount: 8, collaborators: 3, color: 'bg-green-500' },
          { id: '3', title: 'Cadastral Survey Automation', role: 'viewer', documentCount: 42, collaborators: 12, color: 'bg-purple-500' },
          { id: '4', title: 'Coastal Zone Regulations', role: 'editor', documentCount: 5, collaborators: 2, color: 'bg-orange-500' }
        ]);
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 px-2">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight mb-2">Collaborative Workspaces</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Organize research, policies, and collaborate across departments.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search workspaces..." 
              className="w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <div className="flex bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button className="shrink-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Plus className="h-4 w-4 mr-2" />
            New Workspace
          </Button>
        </div>
      </div>

      {/* Grid View */}
      <motion.div layout className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1'}`}>
        <AnimatePresence>
          {workspaces.map((ws, i) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={ws.id}
            >
              <Card 
                className={`group cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-neutral-800 hover:border-primary/50 bg-white dark:bg-neutral-900 overflow-hidden relative ${viewMode === 'list' ? 'flex items-center' : ''}`}
                onClick={() => setSelectedWs(ws)}
              >
                {viewMode === 'grid' && (
                  <div className={`h-2 w-full ${ws.color || 'bg-gray-200'}`}></div>
                )}
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1 flex items-center justify-between py-4' : ''}`}>
                  <div className={`${viewMode === 'list' ? 'flex items-center gap-4 flex-1' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${ws.color ? ws.color.replace('bg-', 'bg-').replace('500', '100') : 'bg-gray-100'} ${ws.color ? ws.color.replace('bg-', 'text-').replace('500', '600') : 'text-gray-600'} dark:bg-neutral-800 group-hover:scale-110 transition-transform`}>
                        <Folder className="h-6 w-6" />
                      </div>
                      {viewMode === 'grid' && (
                        <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-primary transition-colors">{ws.title}</h3>
                      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                        <span className={`px-2 py-0.5 rounded border ${ws.role === 'admin' ? 'bg-red-50 text-red-700 border-red-100' : ws.role === 'editor' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {ws.role}
                        </span>
                        <span>• Updated 2h ago</span>
                      </div>
                    </div>
                  </div>

                  <div className={`${viewMode === 'list' ? 'flex items-center gap-8' : 'mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800 flex justify-between items-center'}`}>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 font-medium">
                      <FileText className="h-4 w-4" />
                      {ws.documentCount} files
                    </div>
                    
                    {/* Overlapping Avatar Stack */}
                    <div className="flex -space-x-2 overflow-hidden">
                      {MOCK_COLLABORATORS.slice(0, Math.min(ws.collaborators, 3)).map((collab, idx) => (
                        <div key={idx} className={`inline-flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white dark:ring-neutral-900 ${collab.avatar} text-white font-bold text-xs flex-shrink-0`}>
                          {collab.name.charAt(0)}
                        </div>
                      ))}
                      {ws.collaborators > 3 && (
                        <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900 bg-gray-100 dark:bg-neutral-800 text-[10px] font-bold text-gray-600 dark:text-gray-300">
                          +{ws.collaborators - 3}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {viewMode === 'list' && (
                    <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Slide-out Drawer for Workspace Detail */}
      <AnimatePresence>
        {selectedWs && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWs(null)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: '100%', boxShadow: '-20px 0 25px -5px rgb(0 0 0 / 0.1)' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-900 shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-neutral-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-start">
                <div className="flex gap-4">
                  <div className={`p-3 rounded-2xl ${selectedWs.color ? selectedWs.color.replace('bg-', 'bg-').replace('500', '100') : 'bg-gray-100'} ${selectedWs.color ? selectedWs.color.replace('bg-', 'text-').replace('500', '600') : 'text-gray-600'} shrink-0 mt-1`}>
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{selectedWs.title}</h2>
                    <p className="text-sm text-gray-500 mt-1">Role: <span className="capitalize font-medium">{selectedWs.role}</span></p>
                  </div>
                </div>
                <button onClick={() => setSelectedWs(null)} className="p-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 flex justify-between items-center">
                <div className="flex -space-x-2">
                  {MOCK_COLLABORATORS.slice(0, Math.min(selectedWs.collaborators, 5)).map((collab, idx) => (
                    <div key={idx} className={`inline-flex items-center justify-center h-10 w-10 rounded-full ring-2 ring-white dark:ring-neutral-900 ${collab.avatar} text-white font-bold text-sm flex-shrink-0`} title={collab.name}>
                      {collab.name.charAt(0)}
                    </div>
                  ))}
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900 bg-gray-100 dark:bg-neutral-800 text-xs font-bold text-gray-600 dark:text-gray-300">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-full font-medium" onClick={() => setIsAccessModalOpen(true)}>Manage Access</Button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Documents</h3>
                  <Button size="sm" className="rounded-full shadow-md shadow-primary/20" onClick={() => setIsUploadModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[...Array(selectedWs.documentCount > 5 ? 5 : selectedWs.documentCount)].map((_, i) => (
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={i} 
                      onClick={() => { 
                        setViewDoc({ 
                          name: i === 0 ? `Draft_MasterPlan_V2.pdf` : `Survey_Report_Zone_${i}.docx`, 
                          details: `Added by ${MOCK_COLLABORATORS[i % MOCK_COLLABORATORS.length].name} • ${i+1} days ago` 
                        }); 
                      }} 
                      className="p-4 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center justify-between hover:border-primary/50 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900 dark:text-gray-100 truncate w-48">{i === 0 ? `Draft_MasterPlan_V2.pdf` : `Survey_Report_Zone_${i}.docx`}</p>
                          <p className="text-xs font-medium text-gray-500">Added by {MOCK_COLLABORATORS[i % MOCK_COLLABORATORS.length].name}</p>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded border border-blue-100 dark:border-blue-800">
                        {i === 0 ? 'Editing' : 'Review'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Document View Modal */}
      <AnimatePresence>
        {viewDoc && !isEditorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setViewDoc(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-neutral-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-900/50">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">{viewDoc.name}</h2>
                  <p className="text-sm font-medium text-gray-500">{viewDoc.details}</p>
                </div>
                <button onClick={() => setViewDoc(null)} className="p-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-neutral-950">
                <div className="bg-white dark:bg-neutral-900 shadow-sm border border-gray-200 dark:border-neutral-800 rounded-2xl h-full min-h-[500px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-primary/5">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">Workspace Draft Document</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
                      This is a collaborative draft document currently in the review phase. 
                    </p>
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 px-8" onClick={() => setIsEditorOpen(true)}>
                      Open in Collaborative Editor
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Screen Collaborative Editor Mock */}
      <AnimatePresence>
        {isEditorOpen && viewDoc && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-[60] bg-gray-50 dark:bg-neutral-950 flex flex-col"
          >
            <div className="h-16 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 px-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg">
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-md">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-sm">{viewDoc.name}</h2>
                    <p className="text-xs text-gray-500">Saved to cloud just now</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900 bg-blue-500 text-white text-xs font-bold z-20" title="You">Y</div>
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white dark:ring-neutral-900 bg-green-500 text-white text-xs font-bold z-10" title="Priya Sharma">P</div>
                </div>
                <Button size="sm" className="rounded-full shadow-md">Share</Button>
              </div>
            </div>

            {/* Toolbar Dummy */}
            <div className="h-12 bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-neutral-800 flex items-center px-4 gap-2 shrink-0 overflow-x-auto">
              <select className="bg-gray-100 dark:bg-neutral-800 rounded text-sm px-2 py-1 outline-none dark:text-white">
                <option>Normal text</option>
                <option>Heading 1</option>
              </select>
              <div className="w-px h-6 bg-gray-200 dark:bg-neutral-700 mx-2"></div>
              <select className="bg-gray-100 dark:bg-neutral-800 rounded text-sm px-2 py-1 outline-none dark:text-white">
                <option>Inter</option>
                <option>Arial</option>
              </select>
              <div className="w-px h-6 bg-gray-200 dark:bg-neutral-700 mx-2"></div>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded font-bold dark:text-white">B</button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded italic dark:text-white">I</button>
              <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded underline dark:text-white">U</button>
            </div>

            {/* Editor Canvas */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-gray-100 dark:bg-neutral-950">
              <div className="w-full max-w-[800px] min-h-[1056px] bg-white dark:bg-neutral-900 shadow-lg border border-gray-200 dark:border-neutral-800 p-16 outline-none">
                <h1 className="text-4xl font-bold mb-6 dark:text-white">Urban Planning 2025: Draft Master Plan</h1>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-lg">
                  This document outlines the proposed zoning changes for the expansion of municipal boundaries into adjacent agricultural transition zones.
                </p>
                <div className="relative inline-block mt-4">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg bg-green-50 dark:bg-green-900/20">
                    The primary objective is to balance rapid urban growth with sustainable agricultural practices...
                  </p>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                    className="absolute -right-3 -top-3 z-10"
                  >
                    <MousePointer2 className="h-4 w-4 text-green-500 fill-green-500 -rotate-12" />
                    <div className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap mt-1">Priya Sharma</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadSuccess={() => setIsUploadModalOpen(false)}
      />

      <AnimatePresence>
        {isAccessModalOpen && selectedWs && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAccessModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-neutral-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-neutral-900/50">
                <h2 className="text-xl font-bold dark:text-gray-100">Manage Access</h2>
                <button onClick={() => setIsAccessModalOpen(false)} className="p-2 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-6">
                  <input type="email" placeholder="Invite via email..." className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 outline-none dark:text-white" />
                  <Button>Invite</Button>
                </div>
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase">Current Members ({selectedWs.collaborators})</h3>
                  {MOCK_COLLABORATORS.slice(0, selectedWs.collaborators).map((collab, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 ${collab.avatar} rounded-full flex items-center justify-center text-white font-bold`}>
                          {collab.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-sm">{collab.name}</p>
                          <p className="text-xs text-gray-500">{collab.email}</p>
                        </div>
                      </div>
                      <select 
                        className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-md text-sm px-2 py-1 outline-none dark:text-white"
                        defaultValue={collab.role}
                      >
                        <option>Admin</option>
                        <option>Editor</option>
                        <option>Viewer</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
