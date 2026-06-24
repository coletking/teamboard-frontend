import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';

/**
 * Gate for authenticated routes. While the session is being restored we show a
 * loading state; unauthenticated users are redirected to /login.
 */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
