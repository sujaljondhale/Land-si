import { useState } from 'react';
import { Lightbulb, Send, Code, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Briefcase } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const CHALLENGES = [
  {
    id: 'ai-cadastral',
    title: 'AI in Cadastral Mapping',
    desc: 'Propose ML models to automatically detect boundary shifts in agricultural land using Copernicus satellite imagery. Looking for sub-meter accuracy.',
    grant: '₹5,00,000',
    deadline: 'Oct 30, 2026',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-900/10'
  },
  {
    id: 'blockchain-dispute',
    title: 'Blockchain Dispute Logging',
    desc: 'Design a decentralized ledger system for immutable recording of tribal land dispute claims to ensure transparency and prevent tampering.',
    grant: '₹3,50,000',
    deadline: 'Nov 15, 2026',
    icon: ShieldCheck,
    color: 'from-green-500 to-emerald-600',
    bg: 'bg-green-50 dark:bg-green-900/10'
  },
  {
    id: 'urban-zoning',
    title: 'Dynamic Urban Zoning API',
    desc: 'Develop a microservice that ingests municipal master plans and exposes a real-time GraphQL API for instant zoning verification.',
    grant: '₹2,00,000',
    deadline: 'Dec 01, 2026',
    icon: Briefcase,
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-50 dark:bg-orange-900/10'
  }
];

export function InnovationPortal() {
  const [selectedChallenge, setSelectedChallenge] = useState<any | null>(null);
  const [step, setStep] = useState(1); // 1: form, 2: processing, 3: success

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    
    // Simulate upload and network delay
    setTimeout(() => {
      setStep(3);
    }, 2000);
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#2A7C13] to-[#1f5c0e] rounded-[2.5rem] p-10 sm:p-16 text-white shadow-2xl shadow-primary/30"
      >
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-[#FFF8CF] opacity-10 rounded-full blur-3xl mix-blend-overlay"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white mb-6 text-sm font-semibold tracking-wide border border-white/20">
              <Lightbulb className="h-4 w-4" /> Grand Challenges
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight">Innovation Portal</h1>
            <p className="text-[#FFF8CF] text-lg sm:text-xl font-medium leading-relaxed opacity-90">
              Collaborate on national challenges. Submit policy proposals and cutting-edge tech solutions to active government grants and hackathons.
            </p>
          </div>
          <motion.div 
            animate={{ y: [0, -15, 0] }} 
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="hidden md:flex items-center justify-center w-48 h-48 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.1)]"
          >
            <Lightbulb className="h-24 w-24 text-[#FFF8CF] drop-shadow-2xl" />
          </motion.div>
        </div>
      </motion.div>

      {/* Challenges Grid */}
      <div>
        <div className="flex justify-between items-end mb-8 px-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Active Grants & Challenges</h2>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 dark:bg-neutral-800 px-3 py-1 rounded-full">{CHALLENGES.length} Open</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHALLENGES.map((challenge, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={challenge.id}
            >
              <Card className={`h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-neutral-900 overflow-hidden relative cursor-pointer ring-1 ring-gray-200 dark:ring-neutral-800 hover:ring-primary`} onClick={() => { setSelectedChallenge(challenge); setStep(1); }}>
                <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <CardContent className="p-8 flex flex-col h-full relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${challenge.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <challenge.icon className="h-7 w-7 text-gray-900 dark:text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">{challenge.title}</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 mb-6">
                      {challenge.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100 dark:border-neutral-800">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Grant Amount</span>
                      <span className="text-base font-extrabold text-gray-900 dark:text-white">{challenge.grant}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Closes: {challenge.deadline}</span>
                      <ArrowRight className="h-5 w-5 text-gray-300 group-hover:text-primary transition-colors group-hover:translate-x-1" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedChallenge && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => step !== 2 && setSelectedChallenge(null)}
            />
            <motion.div 
              layoutId={`challenge-${selectedChallenge.id}`}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-neutral-800"
            >
              <div className="p-8 sm:p-10">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div 
                      key="form"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Grant Application</span>
                          <span className="text-gray-500 text-sm font-medium">{selectedChallenge.grant}</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{selectedChallenge.title}</h2>
                        <button onClick={() => setSelectedChallenge(null)} className="absolute top-6 right-6 p-2 bg-gray-100 dark:bg-neutral-800 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                          <span className="sr-only">Close</span>
                          <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>

                      <form id="innovation-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Project Title</label>
                          <input required type="text" className="w-full bg-gray-50 dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none" placeholder="e.g., Geo-Spatial ML for Boundary Detection" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Executive Summary</label>
                          <textarea required rows={4} className="w-full bg-gray-50 dark:bg-neutral-900/50 border border-gray-200 dark:border-neutral-700 rounded-xl p-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all outline-none resize-none" placeholder="Briefly describe your technical approach and expected outcomes..."></textarea>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Proposal Document (PDF)</label>
                          <div className="border-2 border-dashed border-gray-200 dark:border-neutral-700 rounded-xl p-6 text-center hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer relative">
                            <input type="file" required className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf" />
                            <div className="flex flex-col items-center">
                              <div className="p-3 bg-primary/10 rounded-full mb-3">
                                <Send className="h-6 w-6 text-primary" />
                              </div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </form>

                      <div className="pt-4 flex items-center justify-between border-t border-gray-100 dark:border-neutral-800">
                        <Button variant="ghost" onClick={() => setSelectedChallenge(null)}>Cancel</Button>
                        <Button type="submit" form="innovation-form" size="lg" className="px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                          Submit Proposal <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div 
                      key="processing"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-20 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-gray-100 dark:border-neutral-800 rounded-full"></div>
                        <div className="w-20 h-20 border-4 border-primary rounded-full border-t-transparent animate-spin absolute inset-0"></div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Uploading Proposal...</h3>
                        <p className="text-gray-500 dark:text-gray-400">Encrypting and securing your submission.</p>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-12 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4"
                      >
                        <CheckCircle2 className="h-12 w-12" />
                      </motion.div>
                      <div>
                        <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Proposal Submitted!</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-lg leading-relaxed">
                          Your application for <span className="font-semibold text-gray-900 dark:text-gray-200">"{selectedChallenge.title}"</span> has been securely delivered to the review committee.
                        </p>
                      </div>
                      <div className="pt-8">
                        <Button size="lg" variant="outline" onClick={() => setSelectedChallenge(null)} className="rounded-full px-8">
                          Return to Portal
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
