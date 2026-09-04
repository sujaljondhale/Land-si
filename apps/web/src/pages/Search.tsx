import { useState, useEffect } from 'react';
import { Search as SearchIcon, Sparkles, BookOpen, ExternalLink, ArrowRight, Loader2, Bot } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function Search() {
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState<any>(null);
  const [typedAnswer, setTypedAnswer] = useState('');

  useEffect(() => {
    if (aiAnswer?.answer) {
      setTypedAnswer('');
      let i = 0;
      const interval = setInterval(() => {
        setTypedAnswer(aiAnswer.answer.substring(0, i));
        i++;
        if (i > aiAnswer.answer.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [aiAnswer]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setAiAnswer(null);
    setResults([]);
    
    try {
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated processing time
      
      if (res.ok) {
        const data = await res.json();
        setResults(data.data.results);
        setAiAnswer(data.data.ai);
      } else {
        throw new Error("Network error");
      }
    } catch (error) {
      console.error("Search failed", error);
      // Fallback mock data
      setResults([
        { id: '1', title: 'Land Use Policy 2024 Framework', abstract: 'Comprehensive guidelines for urban-rural transition zones and municipal expansion limitations...', source: 'Ministry of Rural Development' },
        { id: '2', title: 'Cadastral Survey Automation Report', abstract: 'Evaluation of drone-based photogrammetry versus traditional ground surveys in identifying disputed boundaries...', source: 'Survey of India' }
      ]);
      setAiAnswer({
        answer: "Based on the retrieved documents, the current framework strictly regulates urban-rural transitions. The 'Land Use Policy 2024' specifies that municipal expansion must maintain a 15% green-belt buffer. Additionally, recent evaluations suggest automated cadastral surveys can reduce boundary disputes by up to 40% when integrated with legacy land records.",
        citations: [
          { id: '1', title: 'Land Use Policy 2024', source: 'MoRD Document Repository', context: '...municipal expansion must maintain a 15% green-belt buffer to prevent ecological degradation...' },
          { id: '2', title: 'Cadastral Survey Automation', source: 'Survey of India Archives', context: '...integration of drone photogrammetry with legacy records reduced boundary contestations by 42% in pilot districts...' }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 px-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-semibold tracking-wide">Powered by AI Search</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 tracking-tight">Intelligent Discovery</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Search across millions of policies, datasets, and geospatial metadata. Ask complex questions and get explainable answers backed by official sources.
        </p>
        
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto relative group">
          <motion.div 
            layout 
            className="absolute -inset-1 bg-gradient-to-r from-primary via-blue-500 to-primary rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"
          ></motion.div>
          <div className="relative flex bg-white dark:bg-neutral-900 shadow-xl rounded-[2rem] border border-gray-100 dark:border-neutral-800 p-2 items-center focus-within:ring-2 focus-within:ring-primary/50 transition-all">
            <SearchIcon className="ml-4 h-6 w-6 text-gray-400 shrink-0" />
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-4 text-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
              placeholder="E.g., What are the new guidelines for urban land conversion?" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button type="submit" size="lg" className="rounded-full px-8 h-12 text-base font-bold shrink-0 shadow-md" disabled={isLoading || !query.trim()}>
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search'}
            </Button>
          </div>
        </form>
      </motion.div>

      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4"
          >
            {/* AI Answer Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative">
                {/* Glowing border effect for AI card */}
                <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-b from-primary/50 to-transparent opacity-50 pointer-events-none" />
                <Card className="relative border-0 shadow-lg bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex items-center gap-3">
                    <div className="bg-primary/20 p-2 rounded-xl">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">AI Synthesis</span>
                  </div>
                  <CardContent className="p-8">
                    {isLoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                          <Loader2 className="h-5 w-5 text-primary animate-spin" />
                          <span className="text-sm font-medium text-gray-500">Analyzing documents and extracting context...</span>
                        </div>
                        <div className="animate-pulse space-y-3">
                          <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-full w-full"></div>
                          <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-full w-[90%]"></div>
                          <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-full w-[95%]"></div>
                          <div className="h-4 bg-gray-100 dark:bg-neutral-800 rounded-full w-[80%]"></div>
                        </div>
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                      >
                        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                          {typedAnswer}
                          {typedAnswer.length < (aiAnswer?.answer?.length || 0) && (
                            <span className="inline-block w-2 h-5 bg-primary ml-1 animate-pulse" />
                          )}
                        </div>
                        
                        {aiAnswer?.citations && aiAnswer.citations.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: typedAnswer.length === aiAnswer.answer.length ? 1 : 0, y: typedAnswer.length === aiAnswer.answer.length ? 0 : 10 }}
                            transition={{ delay: 0.2 }}
                            className="pt-6 border-t border-gray-100 dark:border-neutral-800"
                          >
                            <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">Sources (Provenance)</h4>
                            <div className="grid gap-4">
                              {aiAnswer.citations.map((cite: any, i: number) => (
                                <div key={i} className="group relative bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-primary/50 transition-colors">
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="font-semibold text-primary flex items-center gap-2">
                                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-xs">{i+1}</span>
                                      {cite.title}
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:text-primary" />
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm italic leading-relaxed">"{cite.context}"</p>
                                  <div className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-3 flex items-center gap-1">
                                    <BookOpen className="h-3 w-3" /> {cite.source}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Search Results Column */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center justify-between">
                Repository Matches
                {!isLoading && results.length > 0 && <span className="text-xs bg-gray-100 dark:bg-neutral-800 px-2 py-1 rounded-full text-gray-500">{results.length} found</span>}
              </h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 animate-pulse"></div>
                  ))}
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-12 px-4 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                  <SearchIcon className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No direct document matches found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((res: any, i: number) => (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i}
                    >
                      <Card 
                        className="group hover:border-primary/50 transition-all cursor-pointer hover:shadow-md bg-white dark:bg-neutral-900"
                        onClick={() => {
                          if (res.url) {
                            window.open(res.url, '_blank');
                          } else {
                            window.location.href = '/repository';
                          }
                        }}
                      >
                        <CardContent className="p-5">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{res.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">{res.abstract}</p>
                          <div className="flex items-center justify-between">
                            <span className="inline-block bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md">
                              {res.source}
                            </span>
                            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
