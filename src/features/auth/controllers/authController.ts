import { apiClient } from '../../../api/client';
import type { AuthResponse, User } from '../../../types';

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Raw HTTP calls for authentication. No React/state here. */
export const authController = {
  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', payload).then((r) => r.data),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

  me: () => apiClient.get<User>('/auth/me').then((r) => r.data),
};
