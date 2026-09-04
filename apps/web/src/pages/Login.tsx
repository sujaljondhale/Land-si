import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import type { Role } from '../lib/auth/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Map, Users, Database } from 'lucide-react';

export function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('public');
  const [email, setEmail] = useState('citizen@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const roles: { id: Role; label: string; email: string; icon: React.ElementType }[] = [
    { id: 'public', label: 'Citizen', email: 'citizen@example.com', icon: Users },
    { id: 'researcher', label: 'Researcher', email: 'researcher@univ.edu', icon: Map },
    { id: 'institution', label: 'Institution', email: 'institution@ngo.org', icon: Database },
    { id: 'policymaker', label: 'Govt Officer', email: 'policymaker@landgov.in', icon: ShieldCheck },
  ];

  const handleRoleSelect = (roleId: Role, roleEmail: string) => {
    setSelectedRole(roleId);
    setEmail(roleEmail);
    setPassword('password123');
    setError('');
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
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4 font-sans">
      <div className="w-full max-w-4xl space-y-5">
        {/* Outer styling matches auth-01 card-in-card */}
        <div className="border border-gray-200 dark:border-neutral-800 bg-gray-100 dark:bg-neutral-900 rounded-[2rem] p-2 md:p-3 shadow-xl">
          <div className="bg-white dark:bg-neutral-950 h-full w-full rounded-[1.5rem] flex flex-col md:flex-row overflow-hidden shadow-[0_2px_4px_0px_rgba(0,0,0,0.12)]">
            
            {/* Left side: Role Selection */}
            <div className="md:w-[45%] bg-[#FFF8CF] dark:bg-neutral-900 p-8 flex flex-col justify-between border-r border-gray-100 dark:border-neutral-800">
              <div>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-6">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Land-si Portal</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed">
                  Select a demonstration role to automatically fill credentials and access your dedicated workspace.
                </p>
              </div>
              
              <div className="mt-8 space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isActive = selectedRole === role.id;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => handleRoleSelect(role.id, role.email)}
                      className={`w-full group flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 ${
                        isActive 
                          ? 'border-primary bg-white dark:bg-primary/10 shadow-sm' 
                          : 'border-transparent hover:border-gray-300 dark:hover:border-neutral-700 bg-white/50 dark:bg-neutral-800/50 hover:bg-white dark:hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 dark:bg-neutral-800 text-gray-500 group-hover:text-primary transition-colors'}`}>
                          <Icon size={18} />
                        </div>
                        <div className="text-left">
                          <p className={`text-sm font-semibold ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{role.label}</p>
                          <p className={`text-xs ${isActive ? 'text-primary' : 'text-gray-500 dark:text-gray-400'}`}>{role.email}</p>
                        </div>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: Login Form */}
            <div className="md:w-[55%] p-8 md:p-12 flex flex-col justify-center">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Welcome back</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5 max-w-sm mx-auto w-full">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded-lg text-sm text-center font-medium">
                    {error}
                  </div>
                )}
                
                <div className="space-y-6 pt-2">
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
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
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
                      className="absolute left-11 top-1/2 -translate-y-1/2 text-gray-500 text-base transition-all duration-200 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-primary [&:not(:placeholder-shown)]:-translate-y-7 [&:not(:placeholder-shown)]:scale-75 [&:not(:placeholder-shown)]:text-primary origin-left pointer-events-none bg-white dark:bg-neutral-950 px-1 -ml-1"
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

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                    <span className="text-gray-600 dark:text-gray-400">Remember me</span>
                  </label>
                  <button type="button" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                    Forgot password?
                  </button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-[15px] font-semibold tracking-wide rounded-xl bg-primary hover:bg-[#1f5c0e] text-white shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
                >
                  Continue to workspace
                </Button>
                
                <div className="pt-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need support? <button type="button" className="text-primary font-semibold hover:underline underline-offset-4 transition-all">Contact admin</button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
