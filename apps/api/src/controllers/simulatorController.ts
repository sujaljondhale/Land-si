import { Request, Response } from 'express';

export const runSimulation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { scenarioId, parameters } = req.body;
    
    const urbanGrowth = parseFloat(parameters?.urbanGrowth) || 5;
    const taxIncrement = parseFloat(parameters?.taxIncrement) || 2;
    
    // Simulate complex model execution delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Dynamic math for mock results
    const econ = (urbanGrowth * 0.4 + taxIncrement * 0.2).toFixed(1);
    const env = (urbanGrowth * 0.3 + taxIncrement * 0.1).toFixed(1);
    const disputeRisk = urbanGrowth > 7 ? 'Critical in Zone B' : (taxIncrement > 10 ? 'High in Zone A' : 'Moderate');

    const p1 = Math.round(100 + (urbanGrowth * 1));
    const p2 = Math.round(102 + (urbanGrowth * 2));
    const p3 = Math.round(105 + (urbanGrowth * 2.5));

    res.json({
      data: {
        status: 'completed',
        explainability: `The model evaluated the impact based on the 2024 regional datasets and expected ${urbanGrowth}% urban growth with a ${taxIncrement}% tax increment.`,
        results: {
          economicImpact: `+${econ}%`,
          environmentalScore: `-${env}`,
          disputeProbability: disputeRisk,
          chartData: [
            { year: '2025', current: 100, predicted: p1 },
            { year: '2026', current: 102, predicted: p2 },
            { year: '2027', current: 105, predicted: p3 },
          ]
        }
      },
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Simulation failed' } });
  }
};
