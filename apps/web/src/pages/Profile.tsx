import { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Shield, CheckCircle, Phone, Building2, MapPin, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export function Profile() {
  const { user } = useAuth();
  
  // Basic info
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  
  // Extended info (mocking these as they might not be in the initial user object)
  const [phone, setPhone] = useState('+91 98765 43210');
  const [organization, setOrganization] = useState(user?.role === 'admin' ? 'Ministry of Rural Development' : 'Public Research Institute');
  const [department, setDepartment] = useState('Land Records Division');
  const [location, setLocation] = useState('New Delhi, India');
  const [bio, setBio] = useState('Senior policy researcher focusing on urban-rural land transitions and geospatial mapping technologies.');

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">My Profile</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">Manage your personal information, credentials, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <Card className="md:col-span-1 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm h-fit">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <div className="h-32 w-32 bg-primary/10 dark:bg-primary/20 text-primary rounded-full flex items-center justify-center ring-4 ring-white dark:ring-neutral-900 shadow-xl overflow-hidden relative">
                <User className="h-16 w-16" />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold">Change Photo</span>
                  </div>
                )}
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{name}</h2>
            <div className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary mb-6">
              <Shield className="h-3.5 w-3.5 mr-1.5" />
              {user.role}
            </div>
            
            <div className="w-full space-y-4 text-left border-t border-gray-100 dark:border-neutral-800 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <Building2 className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{organization}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        <Card className="md:col-span-2 border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-100 dark:border-neutral-800 pb-6">
            <CardTitle className="text-xl">Personal Details</CardTitle>
            {!isEditing && (
              <Button variant="outline" className="rounded-full shadow-sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-[0.8] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-900 px-1 -ml-1"
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
                        className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-[0.8] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-900 px-1 -ml-1"
                      >
                        Email Address
                      </label>
                    </div>

                    <div className="relative group pt-2">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                      <Input 
                        id="profile-phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder=" "
                        className="peer pl-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                      />
                      <label 
                        htmlFor="profile-phone" 
                        className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-[0.8] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-900 px-1 -ml-1"
                      >
                        Phone Number
                      </label>
                    </div>

                    <div className="relative group pt-2">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                      <Input 
                        id="profile-dept"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder=" "
                        className="peer pl-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                      />
                      <label 
                        htmlFor="profile-dept" 
                        className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-[0.8] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-[0.8] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-900 px-1 -ml-1"
                      >
                        Department
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                      <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                        <User className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{user.name}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address</label>
                      <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                        <Mail className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{user.email}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Phone Number</label>
                      <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                        <Phone className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{phone}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Department</label>
                      <div className="flex items-center p-3.5 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                        <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                        <span className="text-gray-900 dark:text-gray-200 font-medium">{department}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bio Section */}
              <div className="pt-2">
                {isEditing ? (
                  <div className="relative group pt-2">
                    <textarea 
                      id="profile-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder=" "
                      rows={4}
                      className="peer h-28 p-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-6 resize-none"
                    />
                    <label 
                      htmlFor="profile-bio" 
                      className="absolute left-4 top-6 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-8 peer-focus:scale-[0.8] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-8 [&:not(:placeholder-shown)]:scale-[0.8] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-900 px-1 -ml-1"
                    >
                      Professional Bio
                    </label>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Professional Bio</label>
                    <div className="p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                        {bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-6 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-3"
                >
                  <Button type="button" variant="outline" className="rounded-full h-11 px-6 font-medium shadow-sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button type="submit" disabled={saved} className="rounded-full h-11 px-8 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    {saved ? (
                      <><CheckCircle className="h-5 w-5 mr-2" /> Saved!</>
                    ) : 'Save Changes'}
                  </Button>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
