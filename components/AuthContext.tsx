import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '../app/utils/useStorageState';

const AuthContext = createContext<{
  signIn: (payload: any) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('token');

  return (
    <AuthContext.Provider
      value={{
        signIn: (payload) => {
          // Perform sign-in logic here
          setSession(payload);
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
