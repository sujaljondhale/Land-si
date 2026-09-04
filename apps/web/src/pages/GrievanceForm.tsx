import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function GrievanceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [category, setCategory] = useState('Encroachment');

  const handleDetectLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setIsLocating(false);
        },
        (err) => {
          console.error(err);
          alert("Could not detect your location. Please check browser permissions or enter it manually.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      alert("Please pin a location first!");
      return;
    }
    
    try {
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      await fetch('http://localhost:3000/public/grievance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title: 'Dispute', 
          description: 'desc', 
          lat: location?.lat || 0, 
          lng: location?.lng || 0,
          address: manualAddress
        })
      });
      setSubmitted(true);
    } catch (e) {
      console.error(e);
    }
  };

  if (submitted) {
    let department = "Land Records Office";
    if (category === "Encroachment") department = "Revenue Department & Local Police";
    else if (category === "Illegal Construction") department = "Municipal Corporation / Development Authority";
    else if (category === "Boundary Dispute") department = "Land Records Office (Tehsildar)";

    return (
      <div className="max-w-md mx-auto mt-10 text-center space-y-4">
        <div className="h-16 w-16 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
        <h2 className="text-xl font-bold dark:text-gray-100">Grievance Submitted</h2>
        <p className="text-gray-500 dark:text-gray-400">Your dispute has been geo-tagged and sent for triage. Reference ID: #GRV-{Date.now().toString().slice(-6)}</p>
        
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800 text-left">
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Routing Information</p>
          <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Based on the category "<strong>{category}</strong>", this grievance has been automatically routed to: <br/><span className="font-bold">{department}</span></p>
        </div>

        <Button onClick={() => { setSubmitted(false); setLocation(null); setManualAddress(''); }} variant="outline" className="mt-4">Submit Another</Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Submit Land Grievance</h1>
        <p className="text-gray-500 dark:text-gray-400">Report land-use violations or disputes directly.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dispute Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block dark:text-gray-200">Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-gray-300 dark:border-neutral-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7C13] bg-white dark:bg-neutral-800 dark:text-gray-100" 
                required
              >
                <option value="Encroachment">Encroachment</option>
                <option value="Illegal Construction">Illegal Construction</option>
                <option value="Boundary Dispute">Boundary Dispute</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block dark:text-gray-200">Description</label>
              <textarea className="w-full rounded-md border border-gray-300 dark:border-neutral-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7C13] bg-white dark:bg-neutral-800 dark:text-gray-100" rows={4} required></textarea>
            </div>
            
            <div className="border dark:border-neutral-700 rounded-lg p-4 bg-gray-50 dark:bg-neutral-900/50 flex flex-col space-y-3">
              <label className="text-sm font-medium block dark:text-gray-200">Geo-tag Location</label>
              
              {location ? (
                <div className="flex items-center justify-between bg-white dark:bg-neutral-800 p-3 border border-green-200 dark:border-green-800/50 rounded text-green-800 dark:text-green-400 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-red-500 dark:text-red-400" />
                    <span className="text-sm font-medium">Location Pinned</span>
                  </div>
                  <span className="text-xs font-mono">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed py-8 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-600 dark:text-gray-400 dark:border-neutral-600"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                >
                  <Navigation className={`h-5 w-5 mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Detecting GPS Coordinates...' : 'Detect My Location'}
                </Button>
              )}
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-300 dark:border-neutral-600"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or</span>
                <div className="flex-grow border-t border-gray-300 dark:border-neutral-600"></div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block dark:text-gray-200 text-gray-700">Enter Address Manually</label>
                <input 
                  type="text" 
                  placeholder="e.g. Plot 42, Sector 15, New Delhi"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-neutral-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7C13] bg-white dark:bg-neutral-800 dark:text-gray-100" 
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={!location && !manualAddress.trim()}>Submit Grievance</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
