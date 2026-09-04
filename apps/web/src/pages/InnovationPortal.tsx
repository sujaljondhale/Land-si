import { useState } from 'react';
import { Lightbulb, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function InnovationPortal() {
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-[#2A7C13] rounded-xl p-8 text-white flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-3xl font-bold mb-2">Innovation Portal</h1>
          <p className="text-[#FFF8CF] max-w-xl">
            Collaborate on national challenges. Submit policy proposals and tech solutions to active government grants.
          </p>
        </div>
        <Lightbulb className="h-16 w-16 text-[#FBE6C2] opacity-80 hidden md:block" />
      </div>

      <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">Active Challenges</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">AI in Cadastral Mapping</CardTitle>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Open</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              Propose ML models to automatically detect boundary shifts in agricultural land using Copernicus satellite imagery.
            </p>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs font-semibold text-gray-500">Grant: ₹5,00,000</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedChallenge('AI in Cadastral Mapping')}>
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">Blockchain Dispute Logging</CardTitle>
              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Open</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 line-clamp-3">
              Design a decentralized ledger system for immutable recording of tribal land dispute claims to ensure transparency.
            </p>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-xs font-semibold text-gray-500">Grant: ₹3,50,000</span>
              <Button size="sm" variant="outline" onClick={() => setSelectedChallenge('Blockchain Dispute Logging')}>
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedChallenge && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Apply for Challenge</h2>
              <button onClick={() => { setSelectedChallenge(null); setSubmitted(false); }} className="text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none">&times;</button>
            </div>
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Proposal Submitted!</h3>
                  <p className="text-gray-500">Your application for "{selectedChallenge}" has been sent to the review committee.</p>
                </div>
              ) : (
                <form id="innovation-form" className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                  const abstract = (form.elements.namedItem('abstract') as HTMLTextAreaElement).value;
                  
                  try {
                    const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
                    const res = await fetch('http://localhost:3000/public/innovation', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify({ challenge: selectedChallenge, title, abstract })
                    });
                    if (res.ok) {
                      setSubmitted(true);
                    } else {
                      alert('Failed to submit proposal.');
                    }
                  } catch (err) {
                    alert('Network error while submitting.');
                  }
                }}>
                  <p className="text-sm font-medium text-gray-700">Challenge: <span className="text-[#2A7C13]">{selectedChallenge}</span></p>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <input name="title" required type="text" className="w-full border-gray-300 rounded-md shadow-sm border p-2" placeholder="Enter your project title..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Pitch (Abstract)</label>
                    <textarea name="abstract" required rows={4} className="w-full border-gray-300 rounded-md shadow-sm border p-2" placeholder="Briefly describe your solution..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Full Proposal (PDF)</label>
                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                  </div>
                </form>
              )}
            </div>
            {!submitted && (
              <div className="p-4 border-t bg-gray-50 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedChallenge(null)}>Cancel</Button>
                <Button type="submit" form="innovation-form">Submit Application</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
