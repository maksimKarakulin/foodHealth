import React, { createContext, useContext, ReactNode } from 'react';
import { useUser, ClerkProvider } from '@clerk/nextjs';

interface AuthContextType {
  userId: string | null;
  isSignedIn: boolean;
  user: ReturnType<typeof useUser>['user'] | null;
  clerkLoaded: boolean;
  signIn: () => void; // Placeholder for sign-in if needed outside of Clerk components
  signOut: () => void; // Placeholder for sign-out if needed outside of Clerk components
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { userId, isSignedIn, user, isLoaded: clerkLoaded } = useUser();

  // Placeholders for signIn and signOut functions if you need to trigger them programmatically
  const signIn = () => {
    // Redirect to Clerk sign-in page or handle programmatically
    console.warn("Sign-in placeholder function called. Implement Clerk redirect or programmatic sign-in.");
  };

  const signOut = () => {
    // Redirect to Clerk sign-out page or handle programmatically
    console.warn("Sign-out placeholder function called. Implement Clerk redirect or programmatic sign-out.");
  };


  const value: AuthContextType = {
    userId,
    isSignedIn,
    user,
    clerkLoaded,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
