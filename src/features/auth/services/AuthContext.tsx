import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore the session from the httpOnly cookie via /auth/me. A 401 simply
  // means "not logged in" — no token is read in JS.
  useEffect(() => {
    authController
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload) {
    const { user } = await authController.login(payload);
    setUser(user);
  }

  async function signup(payload: SignupPayload) {
    const { user } = await authController.signup(payload);
    setUser(user);
  }

  async function logout() {
    try {
      await authController.logout();
    } catch {
      // Ignore network errors on logout; we clear local state regardless.
    }
    setUser(null);
  }

  const value = useMemo(
    () => ({ user, isLoading, login, signup, logout }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
