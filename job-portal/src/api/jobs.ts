import type { Job } from '../types';

const API_URL = 'http://localhost:8000/api';

export const fetchJobs = async (): Promise<Job[]> => {
  const response = await fetch(`${API_URL}/jobs/`);
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
};

export const fetchJobById = async (id: string): Promise<Job> => {
  const response = await fetch(`${API_URL}/jobs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }
  return response.json();
};

export const createJob = async (job: Omit<Job, 'id'>): Promise<Job> => {
  const response = await fetch(`${API_URL}/jobs/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error('Failed to create job');
  }
  return response.json();
}; 