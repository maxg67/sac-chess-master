
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define user type
type User = {
  id: string;
  name: string;
  email: string;
  role: 'player' | 'admin' | 'superadmin';
};

// Define the context type
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

// Sample users for demo
const DEMO_USERS: User[] = [
  {
    id: 'p1',
    name: 'John Player',
    email: 'player@example.com',
    role: 'player'
  },
  {
    id: 'a1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 's1',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    role: 'superadmin'
  }
];

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for stored user on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('chessAtSacUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, validate with API/backend
    // For demo, just check against our sample users
    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const foundUser = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser && password === 'password') { // Very simple password check for demo
      setUser(foundUser);
      localStorage.setItem('chessAtSacUser', JSON.stringify(foundUser));
      toast.success(`Welcome back, ${foundUser.name}!`);
      setLoading(false);
      return true;
    } else {
      toast.error('Invalid email or password');
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('chessAtSacUser');
    toast.info('You have been logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
