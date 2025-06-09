import type { JobApplication } from '../types';

const API_URL = 'http://localhost:8000/api';

export const fetchApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(`${API_URL}/applications/`);
  if (!response.ok) {
    throw new Error('Failed to fetch applications');
  }
  return response.json();
};

export const fetchApplicationById = async (id: string): Promise<JobApplication> => {
  const response = await fetch(`${API_URL}/applications/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch application');
  }
  return response.json();
};

export const createApplication = async (application: Omit<JobApplication, 'id'>): Promise<JobApplication> => {
  const response = await fetch(`${API_URL}/applications/`, {
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
}; 