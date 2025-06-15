import type { Job, JobCreate } from '../types';
import { API_CONFIG } from './config';
import { apiClient } from './client';

export async function getJobs(): Promise<Job[]> {
  return apiClient<Job[]>(API_CONFIG.ENDPOINTS.JOBS.BASE);
}

export async function createJob(job: JobCreate): Promise<Job> {
  return apiClient<Job>(API_CONFIG.ENDPOINTS.JOBS.BASE, {
    method: 'POST',
    body: JSON.stringify(job),
  });
}

export async function updateJob(jobId: string, job: JobCreate): Promise<Job> {
  return apiClient<Job>(`${API_CONFIG.ENDPOINTS.JOBS.BASE}/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(job),
  });
}

export async function deleteJob(jobId: string): Promise<void> {
  return apiClient<void>(`${API_CONFIG.ENDPOINTS.JOBS.BASE}/${jobId}`, {
    method: 'DELETE',
  });
} 