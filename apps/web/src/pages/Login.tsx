import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import type { Role } from '../lib/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Map, Users, Database, ChevronDown, Check } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('public');
  const [email, setEmail] = useState('citizen@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Custom Select State
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const roles: { id: Role; label: string; email: string; icon: React.ElementType }[] = [
    { id: 'public', label: 'Citizen', email: 'citizen@example.com', icon: Users },
    { id: 'researcher', label: 'Researcher', email: 'researcher@univ.edu', icon: Map },
    { id: 'institution', label: 'Institution', email: 'institution@ngo.org', icon: Database },
    { id: 'policymaker', label: 'Govt Officer', email: 'policymaker@landgov.in', icon: ShieldCheck },
  ];

  const activeRole = roles.find(r => r.id === selectedRole) || roles[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleSelect = (roleId: Role, roleEmail: string) => {
    setSelectedRole(roleId);
    setEmail(roleEmail);
    setPassword('password123');
    setError('');
    setIsSelectOpen(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError('');
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4 py-12 font-sans">
      <div className="w-full max-w-sm space-y-5">
        <div className="border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 rounded-[2.5rem] p-2 shadow-xl">
          <div className="bg-white dark:bg-neutral-950 h-full w-full rounded-[2rem] px-6 py-10 shadow-[0_2px_4px_0px_rgba(0,0,0,0.12)]">
            
            <div className="space-y-3 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-2">
                <ShieldCheck size={28} />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
                Land-si Portal
              </h1>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                Connect with your workspace
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg text-sm text-center font-medium">
                  {error}
                </div>
              )}
              
              <div className="space-y-4 pt-2">
                
                {/* Animated Custom Select */}
                <div className="relative" ref={selectRef}>
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 block px-1">Demo Role</label>
                  <button
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="flex w-full items-center justify-between h-12 px-4 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl hover:border-gray-300 dark:hover:border-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-primary bg-primary/10 p-1.5 rounded-lg">
                        <activeRole.icon size={16} />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{activeRole.label}</span>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isSelectOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isSelectOpen && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <div className="p-1.5 space-y-1">
                        {roles.map((role) => (
                          <button
                            key={role.id}
                            type="button"
                            onClick={() => handleRoleSelect(role.id, role.email)}
                            className="flex w-full items-center justify-between px-3 py-2.5 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left"
                          >
                            <div className="flex items-center gap-3">
                              <role.icon size={16} className={selectedRole === role.id ? 'text-primary' : 'text-gray-500'} />
                              <div>
                                <p className={`font-medium ${selectedRole === role.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{role.label}</p>
                                <p className="text-xs text-gray-400">{role.email}</p>
                              </div>
                            </div>
                            {selectedRole === role.id && <Check className="h-4 w-4 text-primary" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                  <Input 
                    id="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" " 
                    required
                    className="peer pl-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-6 [&:not(:placeholder-shown)]:scale-[0.85] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
                  >
                    Email address
                  </label>
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors z-10" />
                  <Input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" " 
                    required
                    className="peer pl-11 pr-11 h-12 bg-gray-50 dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 focus-visible:ring-primary/20 focus-visible:border-primary transition-all rounded-xl w-full pt-2"
                  />
                  <label 
                    htmlFor="password" 
                    className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-sm transition-all duration-200 peer-focus:-translate-y-6 peer-focus:scale-[0.85] peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-6 [&:not(:placeholder-shown)]:scale-[0.85] [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4" defaultChecked />
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Remember me</span>
                </label>
                <button type="button" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  Reset password
                </button>
              </div>

              <Button 
                type="submit" 
                className="from-primary to-primary/80 dark:to-primary/70 h-12 w-full bg-gradient-to-b text-[15px] font-semibold text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98] rounded-xl"
              >
                Continue to workspace
              </Button>
            </form>
            
            <div className="mt-8 text-center border-t border-gray-100 dark:border-neutral-800 pt-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <button type="button" className="text-primary font-semibold hover:underline underline-offset-4 transition-all">
                  Request access
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
