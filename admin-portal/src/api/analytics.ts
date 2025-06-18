import { API_CONFIG } from './config';
import { apiClient } from './client';

// Dashboard Metrics Interface
export interface DashboardMetrics {
  // Agency Overview
  active_jobs: number;
  recent_applications: number;
  recent_inquiries: number;
  urgent_inquiries: number;
  totalEmployers: number;
  
  // Trends and Status
  job_trends: Array<{
    date: string;
    count: number;
  }>;
  application_status: Array<{
    status: string;
    count: number;
  }>;
  
  // Recent Activity
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

// Revenue Analytics Interface
export interface RevenueAnalytics {
  total_revenue: number;
  monthly_revenue: number;
  revenue_trend: Array<{
    date: string;
    amount: number;
  }>;
}

// Application Analytics Interface
export interface ApplicationAnalytics {
  applicationsByDate: Array<{
    date: string;
    count: number;
  }>;
  applicationsByJob: Array<{
    jobId: string;
    jobTitle: string;
    count: number;
  }>;
  applicationsByStatus: Array<{
    status: string;
    count: number;
  }>;
}

// Job Analytics Interface
export interface JobAnalytics {
  jobsByCategory: Array<{
    category: string;
    count: number;
  }>;
  jobsByStatus: Array<{
    status: string;
    count: number;
  }>;
  topPerformingJobs: Array<{
    jobId: string;
    jobTitle: string;
    applications: number;
    views: number;
  }>;
}

// Employer Analytics Interface
export interface EmployerAnalytics {
  employersByIndustry: Array<{
    industry: string;
    count: number;
  }>;
  activeEmployers: number;
  employerEngagement: Array<{
    employerId: string;
    companyName: string;
    jobsPosted: number;
    applicationsReceived: number;
  }>;
}

// Analytics API Object
export const analyticsApi = {
  // Dashboard
  getDashboardMetrics: async (agencyId: number): Promise<DashboardMetrics> => {
    return apiClient<DashboardMetrics>(API_CONFIG.ENDPOINTS.ANALYTICS.DASHBOARD(agencyId));
  },

  // Revenue
  getRevenueAnalytics: async (agencyId: number): Promise<RevenueAnalytics> => {
    return apiClient<RevenueAnalytics>(API_CONFIG.ENDPOINTS.ANALYTICS.REVENUE(agencyId));
  },

 
}; 