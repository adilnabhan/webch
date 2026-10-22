import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  gym_id?: number | null;
  gym_name?: string | null;
  profile_picture?: string | null;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setDemoUser: (role: 'customer' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('discipl_access_token');
    const savedUser = localStorage.getItem('discipl_user');
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('discipl_access_token');
        localStorage.removeItem('discipl_user');
      }
    }
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('discipl_access_token', newToken);
    localStorage.setItem('discipl_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('discipl_access_token');
    localStorage.removeItem('discipl_user');
  };

  // Demo user helper for testing without manual login credentials
  const setDemoUser = (role: 'customer' | 'admin') => {
    const demoToken = 'demo_jwt_token_for_preview';
    const demoUser: User = role === 'admin' 
      ? {
          id: 1,
          name: 'Adil Nabhan (Admin)',
          email: 'info@thediscipl.com',
          role: 'admin',
          is_admin: true,
          gym_name: 'Discipl Platform Headquarters',
          profile_picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        }
      : {
          id: 45,
          name: 'Mohammed Shan (Athlete)',
          email: 'shan@thediscipl.com',
          role: 'customer',
          is_admin: false,
          gym_name: 'Alpha Fitness Hub',
          profile_picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        };

    login(demoToken, demoUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isAdmin: user?.is_admin || user?.role === 'admin',
        login,
        logout,
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
