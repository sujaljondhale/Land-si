import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export function UploadModal({ isOpen, onClose, onUploadSuccess }: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [abstract, setAbstract] = useState('');
  const [source, setSource] = useState('data.gov.in');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('abstract', abstract);
      formData.append('source', source);
      formData.append('file', file);

      // We are simulating the API call since the backend is ready, 
      // but we need the frontend to point to the correct URL and handle Auth.
      const token = JSON.parse(localStorage.getItem('mockUser') || '{}')?.token;
      
      const res = await fetch('http://localhost:3000/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      onUploadSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      alert('Upload failed. Note: API must be running.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-lg bg-white">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>Upload Document</CardTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input 
                required 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g. Land Use Policy 2024" 
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Abstract</label>
              <textarea 
                required 
                value={abstract} 
                onChange={e => setAbstract(e.target.value)} 
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
                rows={3}
                placeholder="Brief summary..."
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Source</label>
              <select 
                value={source} 
                onChange={e => setSource(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2A7C13]"
              >
                <option value="data.gov.in">data.gov.in</option>
                <option value="Bhuvan">Bhuvan</option>
                <option value="NJDG">NJDG</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">File (PDF, Doc)</label>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  {file ? file.name : "Click to select a file"}
                </span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={e => e.target.files && setFile(e.target.files[0])}
                  required
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" disabled={!file || isUploading}>
                {isUploading ? 'Uploading...' : 'Upload & Index'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
