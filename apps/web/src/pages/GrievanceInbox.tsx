import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AlertCircle, CheckCircle, Clock, Search, MapPin } from 'lucide-react';

export function GrievanceInbox() {
  const [activeTab, setActiveTab] = useState('pending');
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
        }
      } catch (err) {
        console.error('Failed to fetch grievances', err);
      }
    };
    
    fetchGrievances();
    // Poll every 5 seconds for new grievances (for demo effect)
    const interval = setInterval(fetchGrievances, 5000);
    return () => clearInterval(interval);
  }, []);

  const filtered = grievances.filter(g => g.status === activeTab);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* List Panel */}
      <Card className="w-1/3 flex flex-col h-full border-0 shadow-sm border-r dark:border-neutral-800 rounded-none bg-white dark:bg-neutral-900">
        <div className="p-4 border-b dark:border-neutral-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dispute Triage</h2>
          <div className="flex gap-2 mt-4">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1 text-sm rounded-full ${activeTab === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'}`}
            >
              Pending ({grievances.filter(g=>g.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab('resolved')}
              className={`px-3 py-1 text-sm rounded-full ${activeTab === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'}`}
            >
              Resolved ({grievances.filter(g=>g.status === 'resolved').length})
            </button>
            <button 
              onClick={() => setActiveTab('escalated')}
              className={`px-3 py-1 text-sm rounded-full ${activeTab === 'escalated' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-400'}`}
            >
              Escalated ({grievances.filter(g=>g.status === 'escalated').length})
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No grievances in this queue.</div>
          ) : (
            filtered.map(g => (
              <div 
                key={g.id} 
                onClick={() => setSelectedGrievance(g)}
                className={`p-4 border-b dark:border-neutral-800 cursor-pointer transition-colors ${selectedGrievance?.id === g.id ? 'bg-[#FFF8CF] dark:bg-[#2A7C13]/20 border-l-4 border-l-[#2A7C13]' : 'hover:bg-gray-50 dark:hover:bg-neutral-800/50 border-l-4 border-l-transparent'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{g.id}</span>
                  <span className="text-xs text-gray-500">{g.date}</span>
                </div>
                <div className="text-sm font-medium text-[#2A7C13] dark:text-[#76C457]">{g.category}</div>
                <div className="text-xs text-gray-500 mt-2 truncate">{g.location}</div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Detail Panel */}
      <Card className="flex-1 h-full shadow-sm bg-white dark:bg-neutral-900 overflow-y-auto">
        {selectedGrievance ? (
          <div className="p-8 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{selectedGrievance.id} - {selectedGrievance.category}</h1>
                <p className="text-sm text-gray-500 mt-1">Reported {selectedGrievance.date} by {selectedGrievance.reporter}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wider ${
                selectedGrievance.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                selectedGrievance.status === 'resolved' ? 'bg-green-100 text-green-800 border border-green-200' : 
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {selectedGrievance.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Routed Department</p>
                <p className="font-medium dark:text-gray-200">{selectedGrievance.department}</p>
              </div>
              <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-lg flex items-start gap-2">
                <MapPin className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Geo-Tagged Location</p>
                  <p className="font-medium text-sm dark:text-gray-200">{selectedGrievance.location}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 border-b dark:border-neutral-800 pb-2 mb-4">Grievance Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedGrievance.desc}</p>
            </div>

            {selectedGrievance.status === 'pending' && (
              <div className="pt-6 border-t dark:border-neutral-800 flex gap-4">
                <Button 
                  className="bg-[#2A7C13] hover:bg-[#1f5c0e] text-white flex-1"
                  onClick={async () => {
                    const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
                    await fetch(`http://localhost:3000/admin/grievances/${selectedGrievance.id}/resolve`, {
                      method: 'PATCH',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setSelectedGrievance({...selectedGrievance, status: 'resolved'});
                    setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? {...g, status: 'resolved'} : g));
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Resolved
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 dark:border-red-900"
                  onClick={async () => {
                    const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
                    const res = await fetch(`http://localhost:3000/admin/grievances/${selectedGrievance.id}/escalate`, {
                      method: 'PATCH',
                      headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setSelectedGrievance({...selectedGrievance, status: 'escalated', department: data.department});
                      setGrievances(prev => prev.map(g => g.id === selectedGrievance.id ? {...g, status: 'escalated', department: data.department} : g));
                    }
                  }}
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Escalate to Higher Authority
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Search className="h-16 w-16 mb-4 opacity-20" />
            <p>Select a grievance from the inbox to view details</p>
          </div>
        )}
      </Card>
    </div>
  );
}
