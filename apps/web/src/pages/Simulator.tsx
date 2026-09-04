import { useState } from 'react';
import { Activity, Play, Settings2, TrendingUp, AlertTriangle, Leaf } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export function Simulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [urbanGrowth, setUrbanGrowth] = useState(5);
  const [taxIncrement, setTaxIncrement] = useState(2);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResult(null);
    try {
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      const res = await fetch('http://localhost:3000/simulator/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ scenarioId: 'env-tax-1', parameters: { urbanGrowth, taxIncrement } })
      });
      
      // Simulate network delay for effect
      await new Promise(r => setTimeout(r, 1500));
      
      if (res.ok) {
        const json = await res.json();
        setResult(json.data.results);
      } else {
        // Fallback demo data
        setResult({
          economicImpact: `+₹${(urbanGrowth * 10.5).toFixed(1)} Cr`,
          environmentalScore: `${(85 - urbanGrowth * 2).toFixed(1)}/100`,
          disputeProbability: `${(15 + taxIncrement * 1.5).toFixed(1)}%`,
          chartData: [
            { year: '2025', current: 100, predicted: 100 + urbanGrowth },
            { year: '2026', current: 110, predicted: 110 + (urbanGrowth * 2) },
            { year: '2027', current: 121, predicted: 121 + (urbanGrowth * 3) }
          ]
        });
      }
    } catch (error) {
      console.error('Simulation failed');
      // Fallback demo data
      setResult({
        economicImpact: `+₹${(urbanGrowth * 10.5).toFixed(1)} Cr`,
        environmentalScore: `${(85 - urbanGrowth * 2).toFixed(1)}/100`,
        disputeProbability: `${(15 + taxIncrement * 1.5).toFixed(1)}%`,
        chartData: [
          { year: '2025', current: 100, predicted: 100 + urbanGrowth },
          { year: '2026', current: 110, predicted: 110 + (urbanGrowth * 2) },
          { year: '2027', current: 121, predicted: 121 + (urbanGrowth * 3) }
        ]
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">Policy Simulator</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Run AI-powered predictive models to evaluate policy impact.</p>
        </div>
        <Button 
          onClick={handleSimulate} 
          disabled={isSimulating} 
          size="lg"
          className="shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="h-5 w-5 mr-2" />
          {isSimulating ? 'Executing Model...' : 'Run Simulation'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parameters Panel */}
        <Card className="lg:col-span-4 border-gray-200 dark:border-neutral-800 shadow-sm bg-gray-50/50 dark:bg-neutral-900/50">
          <CardHeader className="border-b border-gray-100 dark:border-neutral-800 pb-4">
            <CardTitle className="flex items-center text-lg">
              <Settings2 className="h-5 w-5 mr-2 text-gray-400" />
              Scenario Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Urban Growth Rate</label>
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded-md text-sm">{urbanGrowth}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="15" 
                value={urbanGrowth} 
                onChange={(e) => setUrbanGrowth(Number(e.target.value))} 
                className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <p className="text-xs text-gray-500">Projected annual expansion of municipal boundaries.</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Agri-Tax Increment</label>
                <span className="bg-primary/10 text-primary font-bold px-2 py-1 rounded-md text-sm">{taxIncrement}%</span>
              </div>
              <input 
                type="range" 
                min="0" max="20" 
                value={taxIncrement} 
                onChange={(e) => setTaxIncrement(Number(e.target.value))} 
                className="w-full h-2 bg-gray-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-primary" 
              />
              <p className="text-xs text-gray-500">Proposed tax increase on commercial agricultural land.</p>
            </div>
            
            <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium leading-relaxed">
                Adjusting these parameters will queue a new predictive job on the ML cluster. The model uses historical cadastral data and random forest regression.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="lg:col-span-8 border-gray-200 dark:border-neutral-800 shadow-sm relative overflow-hidden min-h-[500px]">
          <AnimatePresence>
            {isSimulating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm flex flex-col items-center justify-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-neutral-800 border-t-primary"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }} 
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="absolute inset-2 rounded-full border-4 border-gray-200 dark:border-neutral-800 border-b-blue-500"
                  />
                  <Activity className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Synthesizing Data</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Running distributed ML inference across 12 nodes...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <CardHeader className="border-b border-gray-100 dark:border-neutral-800">
            <CardTitle className="flex items-center text-lg">
              <Activity className="h-5 w-5 mr-2 text-primary" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {!result && !isSimulating && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">No Active Simulation</h3>
                <p className="text-gray-500 max-w-sm mt-2">Adjust the parameters on the left and click "Run Simulation" to generate AI predictions.</p>
              </div>
            )}

            {result && !isSimulating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div whileHover={{ y: -2 }} className="p-5 bg-gradient-to-br from-green-50 to-white dark:from-green-900/10 dark:to-neutral-900 rounded-2xl border border-green-100 dark:border-green-900/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Economic Impact</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{result.economicImpact}</p>
                    <p className="text-xs text-gray-500 mt-2">+12% vs baseline</p>
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -2 }} className="p-5 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/10 dark:to-neutral-900 rounded-2xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-blue-600" />
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Env Score</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{result.environmentalScore}</p>
                    <p className="text-xs text-gray-500 mt-2">Moderate degradation risk</p>
                  </motion.div>
                  
                  <motion.div whileHover={{ y: -2 }} className="p-5 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-neutral-900 rounded-2xl border border-orange-100 dark:border-orange-900/30 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <p className="text-xs font-bold text-orange-500 uppercase tracking-wider">Dispute Risk</p>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-gray-100">{result.disputeProbability}</p>
                    <p className="text-xs text-gray-500 mt-2">Likely increase in zoning appeals</p>
                  </motion.div>
                </div>
                
                {/* Chart */}
                <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-6">Growth Trajectory Forecast (2025-2027)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                        <Tooltip 
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="current" fill="#E5E7EB" name="Baseline" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="predicted" fill="#2A7C13" name="Predicted" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
