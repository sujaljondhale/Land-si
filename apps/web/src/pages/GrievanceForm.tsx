import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation, ChevronDown, Check, FileText, AlertCircle, Maximize } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export function GrievanceForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  const [category, setCategory] = useState('Encroachment');
  
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'Encroachment', label: 'Encroachment', icon: AlertCircle },
    { id: 'Illegal Construction', label: 'Illegal Construction', icon: Maximize },
    { id: 'Boundary Dispute', label: 'Boundary Dispute', icon: MapPin },
  ];

  const activeCategory = categories.find(c => c.id === category) || categories[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    if (!location && !manualAddress.trim()) {
      alert("Please provide a location!");
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
      // Fallback for mockup if fetch fails
      setSubmitted(true);
    }
  };

  if (submitted) {
    let department = "Land Records Office";
    if (category === "Encroachment") department = "Revenue Department & Local Police";
    else if (category === "Illegal Construction") department = "Municipal Corporation / Development Authority";
    else if (category === "Boundary Dispute") department = "Land Records Office (Tehsildar)";

    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-6">
        <div className="h-20 w-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
          <Check className="h-10 w-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold dark:text-gray-100 tracking-tight">Grievance Submitted</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Your dispute has been geo-tagged and sent for triage. <br/>Reference ID: <span className="font-mono text-primary font-medium">#GRV-{Date.now().toString().slice(-6)}</span></p>
        </div>
        
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-blue-800 dark:text-blue-300">
            <Navigation className="h-4 w-4" />
            <p className="font-semibold">Routing Information</p>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400">Based on the category "<strong>{category}</strong>", this grievance has been automatically routed to: <br/><span className="font-bold block mt-1">{department}</span></p>
        </div>

        <Button 
          onClick={() => { setSubmitted(false); setLocation(null); setManualAddress(''); }} 
          variant="outline" 
          className="rounded-xl h-12 w-full font-semibold border-gray-200 dark:border-neutral-800"
        >
          Submit Another Grievance
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
          <FileText size={24} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">Submit Land Grievance</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Report land-use violations, disputes, or illegal constructions directly to the authorities.</p>
      </div>

      <Card className="rounded-[2rem] border-gray-200 dark:border-neutral-800 shadow-xl overflow-hidden">
        <div className="bg-gray-50/50 dark:bg-neutral-900/50 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Animated Select */}
            <div className="relative" ref={selectRef}>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block px-1">Grievance Category</label>
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="flex w-full items-center justify-between h-14 px-4 bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl hover:border-gray-300 dark:hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="text-primary bg-primary/10 p-2 rounded-lg">
                    <activeCategory.icon size={18} />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{activeCategory.label}</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSelectOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => { setCategory(cat.id); setIsSelectOpen(false); }}
                        className="flex w-full items-center justify-between px-3 py-3 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <cat.icon size={18} className={category === cat.id ? 'text-primary' : 'text-gray-500'} />
                          <p className={`font-medium ${category === cat.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{cat.label}</p>
                        </div>
                        {category === cat.id && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative group pt-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 block px-1">Description</label>
              <textarea 
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-800 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white dark:bg-neutral-950 dark:text-gray-100 shadow-sm transition-all resize-none min-h-[120px]" 
                placeholder="Provide details about the dispute or violation..."
                rows={4} 
                required
              ></textarea>
            </div>
            
            <div className="border border-gray-200 dark:border-neutral-800 rounded-2xl p-6 bg-white dark:bg-neutral-950 flex flex-col space-y-5 shadow-sm">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-5 w-5 text-gray-400" />
                <label className="text-sm font-semibold dark:text-gray-200">Location Proof</label>
              </div>
              
              {location ? (
                <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/10 p-4 border border-green-200 dark:border-green-800/50 rounded-xl text-green-800 dark:text-green-400 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="font-semibold">GPS Coordinates Pinned</span>
                  </div>
                  <span className="text-sm font-mono font-medium bg-white dark:bg-black/20 px-3 py-1 rounded-md">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </span>
                </div>
              ) : (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full border-dashed border-2 py-10 bg-gray-50 dark:bg-neutral-900/50 hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-600 dark:text-gray-400 dark:border-neutral-700 rounded-xl font-medium transition-all"
                  onClick={handleDetectLocation}
                  disabled={isLocating}
                >
                  <Navigation className={`h-5 w-5 mr-3 ${isLocating ? 'animate-spin' : ''}`} />
                  {isLocating ? 'Acquiring Satelite Lock...' : 'Auto-Detect Current Location'}
                </Button>
              )}
              
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200 dark:border-neutral-800"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-semibold uppercase tracking-widest">Or</span>
                <div className="flex-grow border-t border-gray-200 dark:border-neutral-800"></div>
              </div>

              <div className="relative group">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                <Input 
                  id="manualAddress"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  placeholder=" "
                  className="peer pl-11 h-14 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-3 shadow-sm"
                />
                <label 
                  htmlFor="manualAddress" 
                  className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-6 [&:not(:placeholder-shown)]:scale-[0.85] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-gray-50 dark:bg-neutral-900 px-1 -ml-1 group-hover:bg-white dark:group-hover:bg-neutral-950 peer-focus:bg-white dark:peer-focus:bg-neutral-950"
                >
                  Enter manual address (e.g. Plot 42, Sector 15)
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-[16px] font-semibold tracking-wide rounded-xl bg-primary hover:bg-[#1f5c0e] text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98]" 
              disabled={!location && !manualAddress.trim()}
            >
              Submit Grievance
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
