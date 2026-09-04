import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Role = 'public' | 'researcher' | 'institution' | 'policymaker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('mockUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // any cross-tab syncing can go here later if needed
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const res = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const json = await res.json();
        const mockUser: User = {
          id: json.data.user.id,
          name: json.data.user.name,
          email: json.data.user.email,
          role: json.data.user.role,
          token: json.data.token,
        };
        setUser(mockUser);
        localStorage.setItem('mockUser', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (e) {
      console.error('Login failed', e);
      throw e;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
