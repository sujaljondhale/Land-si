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
          <form onSubmit={handleSave} className="space-y-8 mt-4">
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="h-24 w-24 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mt-2">
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  {user.role} Role
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {isEditing ? (
                <>
                  <div className="relative group pt-2">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                    <Input 
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=" "
                      required
                      className="peer pl-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                    />
                    <label 
                      htmlFor="profile-name" 
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
                    >
                      Full Name
                    </label>
                  </div>
                  
                  <div className="relative group pt-2">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                    <Input 
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=" "
                      required
                      className="peer pl-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                    />
                    <label 
                      htmlFor="profile-email" 
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
                    >
                      Email Address
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                    <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                      <User className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-200 font-medium">{user.name}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                    <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-neutral-800">
                      <Mail className="h-5 w-5 mr-3 text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-200 font-medium">{user.email}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {isEditing && (
              <div className="pt-6 mt-4 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" className="rounded-xl h-10 px-6 font-medium" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" disabled={saved} className="rounded-xl h-10 px-8 bg-primary hover:bg-[#1f5c0e] text-white font-medium shadow-md shadow-primary/20 transition-all">
                  {saved ? (
                    <><CheckCircle className="h-4 w-4 mr-2" /> Saved!</>
                  ) : 'Save Changes'}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
