import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/services/AuthContext';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition ${
    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'
  }`;

/** App shell: top bar with brand, nav and user menu, plus the routed page. */
export function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold text-indigo-600">
              TeamBoard
            </Link>
            <nav className="flex items-center gap-4">
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/projects" className={navLinkClass}>
                Projects
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">{user?.name}</span>
            <button
              onClick={logout}
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
