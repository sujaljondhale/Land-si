import { useState, useEffect } from 'react';
import { Folder, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Workspace() {
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWs, setSelectedWs] = useState<any>(null);
  const [viewDoc, setViewDoc] = useState<any>(null);

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
        }
      } catch (error) {
        console.error('Failed to fetch workspaces');
      }
    };
    fetchWorkspaces();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Workspaces</h1>
        <p className="text-gray-500">Collaborate on research and organize your collections.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces.map((ws) => (
          <Card key={ws.id} className="hover:border-[#76C457] cursor-pointer" onClick={() => setSelectedWs(ws)}>
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-[#2A7C13]">{ws.title}</CardTitle>
                <Folder className="h-5 w-5 text-gray-400" />
              </div>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded w-fit capitalize">{ws.role}</span>
            </CardHeader>
            <CardContent className="pt-4 flex justify-between items-center text-sm text-gray-500">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                {ws.documentCount} Documents
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {ws.collaborators} Members
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Workspace Detail Modal */}
      {selectedWs && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Folder className="h-6 w-6 text-[#2A7C13]" />
                  {selectedWs.title}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Role: {selectedWs.role} • {selectedWs.collaborators} Collaborators</p>
              </div>
              <button onClick={() => setSelectedWs(null)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Workspace Documents</h3>
                <button className="text-sm bg-[#76C457] text-white px-3 py-1.5 rounded hover:bg-[#65ac49]">
                  + Add Document
                </button>
              </div>
              
              <div className="bg-gray-50 border rounded-lg divide-y">
                {/* Mocked Workspace Documents */}
                {[...Array(selectedWs.documentCount > 3 ? 3 : selectedWs.documentCount)].map((_, i) => (
                  <div key={i} onClick={() => setViewDoc({ name: `Draft_Policy_V${i+1}.pdf`, details: `Added by Collab${i+1} • 2 days ago` })} className="p-4 flex items-center justify-between hover:bg-gray-100 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">Draft_Policy_V{i+1}.pdf</p>
                        <p className="text-xs text-gray-500">Added by Collab{i+1} • 2 days ago</p>
                      </div>
                    </div>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100">
                      In Review
                    </span>
                  </div>
                ))}
                <div className="p-4 text-center text-sm text-gray-500 italic">
                  + {Math.max(0, selectedWs.documentCount - 3)} more documents hidden for demo
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setSelectedWs(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                Close Workspace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {viewDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{viewDoc.name}</h2>
              <button onClick={() => setViewDoc(null)} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-gray-500 mb-4">{viewDoc.details}</p>
              
              <h3 className="font-semibold mb-2">Document Preview</h3>
              <div className="bg-gray-100 border border-gray-200 rounded h-[500px] w-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Workspace Draft Document</h4>
                    <p className="text-gray-500 mb-6 max-w-md">
                      This is a collaborative draft document currently in the review phase. 
                    </p>
                    <button onClick={() => alert("Simulation: Opening collaborative editor")} className="bg-[#2A7C13] text-white px-4 py-2 rounded font-medium hover:bg-[#1f5c0e]">
                      Open in Editor
                    </button>
                  </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setViewDoc(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
