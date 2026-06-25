import axios from 'axios';

// The JWT is kept in an httpOnly cookie set by the backend, so the browser
// sends it automatically. `withCredentials` ensures cookies travel with every
// cross-origin request; JS never reads or stores the token.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const url: string = error.config?.url ?? '';
    // On an expired/invalid session, bounce to login — but let the auth calls
    // (me/login/logout) surface their own 401s to the app logic.
    if (error.response?.status === 401 && !url.startsWith('/auth')) {
      if (window.location.pathname !== '/login') {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  },
);
