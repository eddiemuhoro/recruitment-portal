import { apiClient } from './client';

export interface DashboardData {
  active_jobs: number;
  recent_applications: number;
  recent_inquiries: number;
  urgent_inquiries: number;
  job_trends: Array<{
    date: string;
    count: number;
  }>;
  application_status: Array<{
    status: string;
    count: number;
  }>;
}

export interface RevenueData {
  total_revenue: number;
  monthly_revenue: number;
  revenue_trend: Array<{
    date: string;
    amount: number;
  }>;
}

export const agencyAnalyticsApi = {
  getDashboard: async (agencyId: number): Promise<DashboardData> => {
    return apiClient<DashboardData>(`/agency-analytics/${agencyId}/dashboard`, { requiresAuth: true });
  },

  getRevenue: async (agencyId: number): Promise<RevenueData> => {
    return apiClient<RevenueData>(`/agency-analytics/${agencyId}/revenue`, { requiresAuth: true });
  },
}; 