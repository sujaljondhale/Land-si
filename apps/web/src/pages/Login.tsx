import { useState } from 'react';
import { useAuth } from '../lib/auth/AuthContext';
import type { Role } from '../lib/auth/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const { login } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role>('public');
  const [email, setEmail] = useState('citizen@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const roles: { id: Role; label: string; desc: string; email: string }[] = [
    { id: 'public', label: 'Public / Citizen', desc: 'Search, AI assistant, public GIS', email: 'citizen@example.com' },
    { id: 'researcher', label: 'Researcher', desc: 'Workspaces, RAG, GIS analysis', email: 'researcher@univ.edu' },
    { id: 'institution', label: 'Institution', desc: 'Org roster, bulk upload', email: 'institution@ngo.org' },
    { id: 'policymaker', label: 'Policymaker / Govt', desc: 'Analytics, simulation', email: 'policymaker@landgov.in' },
    { id: 'admin', label: 'Admin', desc: 'Platform administration', email: 'admin@landgov.in' }
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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border border-gray-200 dark:border-neutral-800 shadow-xl bg-white dark:bg-neutral-900">
        {/* Left side: Role Selection (for demo purposes) */}
        <div className="md:w-1/2 bg-gray-50 dark:bg-neutral-900/50 p-6 md:p-8 border-r dark:border-neutral-800 overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#2A7C13] dark:text-[#76C457]">Hackathon Demo Accounts</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Select a role to auto-fill the credentials</p>
          </div>
          <div className="grid gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id, role.email)}
                className={`flex flex-col items-start p-3 border rounded-md text-left transition-colors ${
                  selectedRole === role.id 
                    ? 'border-[#2A7C13] bg-[#FFF8CF] dark:bg-[#2A7C13]/20 dark:border-[#76C457]' 
                    : 'border-gray-200 dark:border-neutral-700 hover:border-[#76C457] dark:hover:border-[#76C457] bg-white dark:bg-neutral-800'
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className={`font-semibold text-sm ${selectedRole === role.id ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>{role.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    selectedRole === role.id 
                    ? 'text-[#2A7C13] bg-[#76C457]/20 dark:text-[#76C457]' 
                    : 'text-gray-500 bg-gray-100 dark:bg-neutral-700 dark:text-gray-400'
                  }`}>{role.email}</span>
                </div>
                <span className={`text-xs mt-1 ${selectedRole === role.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>{role.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Login Form */}
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sign In</h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Welcome to the SIH 26019 Platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 rounded text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-[#2A7C13] hover:bg-[#1f5c0e] text-white" size="lg">
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
