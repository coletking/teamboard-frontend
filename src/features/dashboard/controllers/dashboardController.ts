import { apiClient } from '../../../api/client';
import type { DashboardStats } from '../../../types';

/** Raw HTTP call for the dashboard stats. */
export const dashboardController = {
  getStats: () =>
    apiClient.get<DashboardStats>('/dashboard').then((r) => r.data),
};
