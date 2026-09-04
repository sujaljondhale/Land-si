import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertCircle, CheckCircle, Search, MapPin, Building, Calendar, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function GrievanceInbox() {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'escalated'>('pending');
  const [selectedGrievance, setSelectedGrievance] = useState<any>(null);
  const [grievances, setGrievances] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
        const res = await fetch('http://localhost:3000/admin/grievances', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setGrievances(json.data || []);
        } else {
          throw new Error('Fallback');
        }
      } catch (err) {
        console.error('Failed to fetch grievances', err);
        setGrievances([
          { id: 'GRV-2026-892', category: 'Boundary Dispute', location: 'Plot 42, Sector 9, Rural Hub', date: '2026-09-02', reporter: 'Ramesh Singh', status: 'pending', department: 'Revenue Dept', desc: 'Neighbor has encroached 5 meters into my agricultural plot after the recent floods.' },
          { id: 'GRV-2026-891', category: 'Illegal Construction', location: 'Survey 112, Green Belt', date: '2026-09-01', reporter: 'Priya Sharma', status: 'pending', department: 'Municipal Corp', desc: 'Commercial warehouse being built on land marked as residential/agricultural transition zone.' },
          { id: 'GRV-2026-880', category: 'Mutation Pending', location: 'Ward 4, Urban Limits', date: '2026-08-28', reporter: 'Amit Patel', status: 'escalated', department: 'Sub-Registrar', desc: 'Land mutation application pending for over 6 months despite submitting all valid documents.' },
          { id: 'GRV-2026-875', category: 'Title Discrepancy', location: 'Village Kheri', date: '2026-08-15', reporter: 'Sunita Devi', status: 'resolved', department: 'Land Records', desc: 'Digital record shows incorrect acreage compared to physical title deed.' },
        ]);
      }
    };
    
    fetchGrievances();
  }, []);

  const filtered = grievances.filter(g => g.status === activeTab);

  const handleResolve = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGrievance) return;
    setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? {...g, status: 'resolved'} : g));
    setSelectedGrievance(null);
  };

  const handleEscalate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedGrievance) return;
    setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? {...g, status: 'escalated'} : g));
    setSelectedGrievance(null);
  };

  return (
    <div className="flex h-[calc(100vh-6rem)] gap-6 p-4 max-w-[100rem] mx-auto overflow-hidden">
      {/* List Panel */}
      <Card className="w-[400px] flex flex-col h-full shrink-0 border border-gray-200 dark:border-neutral-800 rounded-3xl shadow-lg bg-white dark:bg-neutral-900 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Dispute Triage</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6 font-medium">Manage and route incoming land grievances</p>
          
          <div className="flex bg-gray-100 dark:bg-neutral-800 rounded-xl p-1 relative">
            <button 
              onClick={() => { setActiveTab('pending'); setSelectedGrievance(null); }}
              className={`flex-1 relative z-10 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'pending' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Pending ({grievances.filter(g=>g.status === 'pending').length})
            </button>
            <button 
              onClick={() => { setActiveTab('escalated'); setSelectedGrievance(null); }}
              className={`flex-1 relative z-10 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'escalated' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Escalated ({grievances.filter(g=>g.status === 'escalated').length})
            </button>
            <button 
              onClick={() => { setActiveTab('resolved'); setSelectedGrievance(null); }}
              className={`flex-1 relative z-10 py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'resolved' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Resolved ({grievances.filter(g=>g.status === 'resolved').length})
            </button>
            
            {/* Sliding Tab Indicator */}
            <motion.div 
              className="absolute top-1 bottom-1 w-[calc(33.333%-4px)] bg-white dark:bg-neutral-700 rounded-lg shadow-sm"
              animate={{ 
                left: activeTab === 'pending' ? '4px' : activeTab === 'escalated' ? 'calc(33.333% + 2px)' : 'calc(66.666% + 0px)'
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto bg-gray-50/30 dark:bg-neutral-950 p-4 relative">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-gray-500"
              >
                <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <p className="font-bold text-gray-700 dark:text-gray-300">Inbox Zero</p>
                <p className="text-sm mt-1">No {activeTab} grievances at the moment.</p>
              </motion.div>
            ) : (
              filtered.map((g, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 400, damping: 30 }}
                  key={g.id} 
                  onClick={() => setSelectedGrievance(g)}
                  className={`p-5 mb-3 rounded-2xl cursor-pointer transition-all border ${
                    selectedGrievance?.id === g.id 
                      ? 'bg-white dark:bg-neutral-900 border-primary shadow-md ring-1 ring-primary/20' 
                      : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-gray-900 dark:text-gray-100 text-sm">{g.id}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-gray-500 bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-md">{g.date}</span>
                  </div>
                  <div className="font-bold text-primary mb-1">{g.category}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 truncate flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{g.location}</span>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </Card>

      {/* Detail Panel */}
      <Card className="flex-1 h-full shadow-lg border border-gray-200 dark:border-neutral-800 rounded-3xl bg-white dark:bg-neutral-900 overflow-hidden flex flex-col relative">
        <AnimatePresence mode="wait">
          {selectedGrievance ? (
            <motion.div 
              key={selectedGrievance.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="flex flex-col h-full"
            >
              <div className="p-8 pb-6 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${
                      selectedGrievance.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                      selectedGrievance.status === 'resolved' ? 'bg-green-100 text-green-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {selectedGrievance.status === 'resolved' ? <CheckCircle className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
                    </div>
                    <div>
                      <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">{selectedGrievance.id}</h1>
                      <span className={`inline-flex items-center mt-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        selectedGrievance.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                        selectedGrievance.status === 'resolved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {selectedGrievance.status}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-full shadow-sm">
                    View Associated Records <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedGrievance.category}</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Metadata Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-primary" />
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Routed Department</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{selectedGrievance.department}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Filing Date</p>
                    </div>
                    <p className="font-bold text-gray-900 dark:text-gray-100">{selectedGrievance.date}</p>
                    <p className="text-xs text-gray-500 mt-1">Reported by {selectedGrievance.reporter}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-neutral-800/50 p-5 rounded-2xl border border-gray-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Geo-Tagged Location</p>
                    </div>
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{selectedGrievance.location}</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="bg-gray-50/50 dark:bg-neutral-900/50 px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm tracking-wide">Grievance Description</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">{selectedGrievance.desc}</p>
                  </div>
                </div>
              </div>

              {selectedGrievance.status === 'pending' && (
                <div className="p-6 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/80 dark:bg-neutral-900/80 backdrop-blur-md flex gap-4 shrink-0">
                  <Button 
                    size="lg"
                    className="flex-1 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform text-base"
                    onClick={handleResolve}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Mark as Resolved
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900 hover:scale-[1.02] active:scale-[0.98] transition-transform text-base bg-white dark:bg-neutral-900"
                    onClick={handleEscalate}
                  >
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Escalate to Higher Authority
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-gray-400"
            >
              <div className="w-24 h-24 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                <Search className="h-10 w-10 text-gray-300 dark:text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">No Selection</h3>
              <p className="text-gray-500 text-center max-w-sm">Select a grievance from the inbox on the left to review its details and take action.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
