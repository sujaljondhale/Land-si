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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden border-0 shadow-xl">
        {/* Left side: Role Selection (for demo purposes) */}
        <div className="md:w-1/2 bg-gray-50 p-8 border-r">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-[#2A7C13]">Hackathon Demo Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">Select a role to auto-fill the credentials</p>
          </div>
          <div className="grid gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleSelect(role.id, role.email)}
                className={`flex flex-col items-start p-3 border rounded-md text-left transition-colors ${
                  selectedRole === role.id 
                    ? 'border-[#2A7C13] bg-[#FFF8CF]' 
                    : 'border-gray-200 hover:border-[#76C457] bg-white'
                }`}
              >
                <div className="flex justify-between w-full">
                  <span className="font-semibold text-sm">{role.label}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{role.email}</span>
                </div>
                <span className="text-xs text-gray-500 mt-1">{role.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Login Form */}
        <div className="md:w-1/2 bg-white p-8 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Sign In</h1>
              <p className="text-gray-500 text-sm mt-2">Welcome to the SIH 26019 Platform</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <Input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
