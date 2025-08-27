// hooks/useDashboard.ts
import { fetchAPI } from '@/api/fetchApi';
import { DashboardResponse } from '@/types/dashboardType';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = () => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data, error } = await fetchAPI.get<DashboardResponse>('/dashboard');
      
      if (error) {
        throw new Error(error);
      }
      
      if (!data) {
        throw new Error('No dashboard data received');
      }
      
      return data;
    },
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};