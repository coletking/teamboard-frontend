import { useQuery } from '@tanstack/react-query';
import { dashboardController } from '../controllers/dashboardController';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardController.getStats,
  });
}
