import type { JobApplication } from '../types';
import { API_CONFIG } from './config';

export const fetchApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
};

export const fetchApplicationById = async (id: string): Promise<JobApplication> => {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch application');
  }
  return response.json();
};

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
}

export async function createApplication(application: Omit<JobApplication, 'id'>): Promise<JobApplication> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(application),
  });
  if (!response.ok) {
    throw new Error('Failed to create application');
  }
  return response.json();
}

export async function updateApplicationStatus(applicationId: string, status: JobApplication['status']): Promise<void> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.STATUS(applicationId)}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update application status');
  }
} 