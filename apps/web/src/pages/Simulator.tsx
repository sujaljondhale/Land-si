import { useState } from 'react';
import { Activity, Play } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Simulator() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [urbanGrowth, setUrbanGrowth] = useState(5);
  const [taxIncrement, setTaxIncrement] = useState(2);

  const handleSimulate = async () => {
    setIsSimulating(true);
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
      if (res.ok) {
        const json = await res.json();
        setResult(json.data.results);
      }
    } catch (error) {
      console.error('Simulation failed');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policy Simulator</h1>
          <p className="text-gray-500">Run predictive models to evaluate policy impact.</p>
        </div>
        <Button onClick={handleSimulate} disabled={isSimulating} size="lg">
          <Play className="h-4 w-4 mr-2" />
          {isSimulating ? 'Running Model...' : 'Run Simulation'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Scenario Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Urban Growth Rate ({urbanGrowth}%)</label>
              <input type="range" min="0" max="15" value={urbanGrowth} onChange={(e) => setUrbanGrowth(Number(e.target.value))} className="w-full accent-[#2A7C13]" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Agricultural Tax Increment ({taxIncrement}%)</label>
              <input type="range" min="0" max="20" value={taxIncrement} onChange={(e) => setTaxIncrement(Number(e.target.value))} className="w-full accent-[#2A7C13]" />
            </div>
            <div className="p-3 bg-blue-50 rounded text-xs text-blue-700">
              Note: Changing these parameters will trigger a new job on the Analytics Worker.
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 min-h-[400px]">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-[#2A7C13]" />
              Simulation Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!result && !isSimulating && (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Adjust parameters and run simulation to see predictions.
              </div>
            )}
            
            {isSimulating && (
              <div className="h-64 flex flex-col items-center justify-center text-[#2A7C13] space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A7C13]"></div>
                <p className="animate-pulse">Executing predictive model...</p>
              </div>
            )}

            {result && !isSimulating && (
              <div className="space-y-6 animate-in fade-in">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-center border">
                    <p className="text-xs text-gray-500 uppercase">Economic Impact</p>
                    <p className="text-xl font-bold text-green-600">{result.economicImpact}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center border">
                    <p className="text-xs text-gray-500 uppercase">Env Score</p>
                    <p className="text-xl font-bold text-red-500">{result.environmentalScore}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg text-center border">
                    <p className="text-xs text-gray-500 uppercase">Dispute Risk</p>
                    <p className="text-xl font-bold text-orange-500">{result.disputeProbability}</p>
                  </div>
                </div>
                
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="current" fill="#e5e7eb" name="Baseline" />
                      <Bar dataKey="predicted" fill="#2A7C13" name="Predicted" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
