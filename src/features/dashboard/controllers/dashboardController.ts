import { apiClient } from '../../../api/client';
import type { DashboardStats } from '../../../types';

export const dashboardController = {
  getStats: () =>
    apiClient.get<DashboardStats>('/dashboard').then((r) => r.data),
};
