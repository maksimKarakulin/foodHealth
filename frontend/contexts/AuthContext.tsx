
import React, { createContext, useContext, useState } from 'react';
interface AuthContextType {
  user: { name: string; email?: string } | null; // More descriptive user type
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ name: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const signIn = () => {
    // Simulate a successful sign-in
    setLoading(true);
    setTimeout(() => {
      setUser({ name: 'Test User', email: 'test@example.com' });
        setLoading(false);
    }, 500); // Simulate a delay
  };

  const signOut = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
