import { useState } from 'react';
import { Search as SearchIcon, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function Search() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setResults(data.data.results);
        setAiAnswer(data.data.ai);
      }
    } catch (error) {
      console.error("Search failed", error);
      // Fallback mock data
      setTimeout(() => {
        setResults([
          { id: '1', title: 'Land Use Policy 2024', abstract: 'Updated policy...', source: 'data.gov.in' }
        ]);
        setAiAnswer({
          answer: "This is a simulated AI response explaining the context of your query based on the retrieved documents.",
          citations: [
            { id: '1', title: 'Land Use Policy 2024', source: 'data.gov.in', context: 'Excerpt here...' }
          ]
        });
        setIsLoading(false);
      }, 1000);
      return;
    }
    
    setIsLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Discovery</h1>
        <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
          Search across policies, datasets, and geospatial metadata. Ask complex questions and get explainable answers backed by sources.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              className="pl-11 h-12 text-lg rounded-full shadow-sm border-gray-300"
              placeholder="Ask a question or search for resources..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="rounded-full px-8" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </form>
      </div>

      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Answer Column */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="border-[#76C457] shadow-sm overflow-hidden">
              <div className="bg-[#FFF8CF] px-4 py-2 border-b border-[#FBE6C2] flex items-center">
                <Sparkles className="h-4 w-4 text-[#2A7C13] mr-2" />
                <span className="text-sm font-semibold text-[#2A7C13]">AI Synthesis</span>
              </div>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{aiAnswer?.answer}</p>
                    
                    {aiAnswer?.citations && aiAnswer.citations.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sources (Provenance)</h4>
                        <ul className="space-y-3">
                          {aiAnswer.citations.map((cite: any, i: number) => (
                            <li key={i} className="text-sm bg-gray-50 p-3 rounded-md border border-gray-100">
                              <div className="font-medium text-[#2A7C13] flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                [{i+1}] {cite.title}
                              </div>
                              <p className="text-gray-500 text-xs mt-1 italic">"{cite.context}"</p>
                              <div className="text-xs text-gray-400 mt-2 flex items-center">
                                <ExternalLink className="h-3 w-3 mr-1" /> {cite.source}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Search Results Column */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Repository Matches</h3>
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <p className="text-sm text-gray-500">No direct matches found.</p>
            ) : (
              results.map((res: any, i: number) => (
                <Card 
                  key={i} 
                  className="hover:border-[#76C457] transition-colors cursor-pointer"
                  onClick={() => {
                    if (res.url) {
                      window.open(res.url, '_blank');
                    } else {
                      window.location.href = '/repository';
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm text-[#2A7C13] mb-1 line-clamp-1">{res.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{res.abstract}</p>
                    <span className="inline-block bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded">
                      {res.source}
                    </span>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
