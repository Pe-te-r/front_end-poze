// hooks/useDashboard.ts
import { fetchAPI } from '@/api/fetchApi';
import { DashboardResponse } from '@/types/dashboardType';
import { useQuery } from '@tanstack/react-query';

export const useDashboard = (dashboardId: string) => {
  return useQuery<DashboardResponse, Error>({
    queryKey: ['dashboard', dashboardId],
    queryFn: async () => {
      // Use the dashboardId in the endpoint
      const { data, error } = await fetchAPI.get<DashboardResponse>(`/dashboard/${dashboardId}`);
      
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
    // Only enable the query if dashboardId is provided
    enabled: !!dashboardId,
  });
};