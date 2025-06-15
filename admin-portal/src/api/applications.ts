import type { JobApplication } from '../types';
import { API_CONFIG } from './config';
import { apiClient } from './client';

export async function getApplications(): Promise<JobApplication[]> {
  return apiClient<JobApplication[]>(API_CONFIG.ENDPOINTS.APPLICATIONS.BASE);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: JobApplication['status']
): Promise<JobApplication> {
  return apiClient<JobApplication>(
    API_CONFIG.ENDPOINTS.APPLICATIONS.STATUS(applicationId),
    {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }
  );
}

export async function getApplicationById(id: string): Promise<JobApplication> {
  return apiClient<JobApplication>(`${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}/${id}`);
} 