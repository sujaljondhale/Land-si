import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Update local mock user
    const updatedUser = { ...user, name, email };
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    
    // Force a reload to reflect across context (hacky for MVP but works)
    setSaved(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your personal information and preferences.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Personal Details</CardTitle>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="h-24 w-24 bg-[#76C457]/20 dark:bg-[#2A7C13]/30 text-[#2A7C13] dark:text-[#76C457] rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 capitalize mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  {user.role} Role
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Full Name</label>
                {isEditing ? (
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-md border border-gray-100 dark:border-neutral-800">
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="dark:text-gray-200">{user.name}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email Address</label>
                {isEditing ? (
                  <Input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                ) : (
                  <div className="flex items-center p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-md border border-gray-100 dark:border-neutral-800">
                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                    <span className="dark:text-gray-200">{user.email}</span>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 border-t dark:border-neutral-800 flex items-center gap-4">
                <Button type="submit" disabled={saved}>
                  {saved ? (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Saved!</>
                  ) : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
