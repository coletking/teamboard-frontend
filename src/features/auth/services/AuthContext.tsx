import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { tokenStore } from '../../../api/client';
import {
  authController,
  type LoginPayload,
  type SignupPayload,
} from '../controllers/authController';
import type { User } from '../../../types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Holds the authenticated session. Persists the JWT to localStorage and
 * restores the user on first load via /auth/me.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authController
      .me()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    const { accessToken, user } = await authController.login(payload);
    tokenStore.set(accessToken);
    setUser(user);
  }

  async function signup(payload: SignupPayload) {
    const { accessToken, user } = await authController.signup(payload);
    tokenStore.set(accessToken);
    setUser(user);
  }

  function logout() {
    tokenStore.clear();
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
