import { Request, Response } from 'express';

// In-memory store for demo
export const globalGrievances: any[] = [
  { id: 'GRV-9281', category: 'Encroachment', department: 'Revenue Dept & Local Police', status: 'pending', date: '2 hours ago', location: 'Plot 42, Sector 15, New Delhi', desc: 'Someone has built a temporary shed extending into the public sidewalk.', reporter: 'citizen@example.com', lat: 28.6139, lng: 77.2090 },
  { id: 'GRV-8472', category: 'Boundary Dispute', department: 'Land Records Office', status: 'pending', date: '1 day ago', location: 'Survey No 14, Outer Ring Road', desc: 'Neighbor has moved the boundary fence by 2 meters into my registered plot.', reporter: 'anonymized', lat: 28.62, lng: 77.22 },
  { id: 'GRV-7104', category: 'Illegal Construction', department: 'Municipal Corporation', status: 'resolved', date: '3 days ago', location: 'M-Block Market Area', desc: 'Commercial construction happening without proper zoning permits.', reporter: 'local_vendor@example.com', lat: 28.63, lng: 77.21 },
];

export const submitGrievance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, lat, lng, address } = req.body;
    
    // Auto-route based on mock category logic (title is used as category in frontend)
    let department = "Land Records Office";
    if (title === "Encroachment") department = "Revenue Department & Local Police";
    else if (title === "Illegal Construction") department = "Municipal Corporation / Development Authority";
    else if (title === "Boundary Dispute") department = "Land Records Office (Tehsildar)";

    const newGrievance = {
      id: `GRV-${Math.floor(Math.random() * 9000) + 1000}`,
      category: title || 'Dispute',
      department: department,
      status: 'pending',
      date: 'Just now',
      location: address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      desc: description,
      reporter: (req as any).user?.email || 'citizen@example.com',
      lat,
      lng
    };

    globalGrievances.unshift(newGrievance);
    
    res.json({
      data: {
        id: newGrievance.id,
        status: 'submitted',
        message: 'Your dispute has been logged and sent for triage.'
      },
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Submission failed' } });
  }
};

export const submitInnovation = async (req: Request, res: Response): Promise<void> => {
  try {
    res.json({
      data: {
        id: `proposal-${Date.now()}`,
        status: 'under_review',
        message: 'Proposal submitted successfully.'
      },
      requestId: req.headers['x-request-id']
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Submission failed' } });
  }
};
