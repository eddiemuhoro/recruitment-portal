import type { Job, JobCreate } from '../types';

const API_URL = 'https://skyways-54mr.onrender.com/api';

export async function getJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/jobs/`);
  if (!response.ok) {
    throw new Error('Failed to fetch jobs');
  }
  return response.json();
}

export async function createJob(job: JobCreate): Promise<Job> {
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
}

export async function updateJob(jobId: string, job: JobCreate): Promise<Job> {
  const response = await fetch(`${API_URL}/jobs/${jobId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job),
  });
  if (!response.ok) {
    throw new Error('Failed to update job');
  }
  return response.json();
}

export async function deleteJob(job_id: string): Promise<void> {
  const response = await fetch(`${API_URL}/jobs/${job_id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete job');
  }
}

export const fetchJobById = async (id: string): Promise<Job> => {
  const response = await fetch(`${API_URL}/jobs/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch job');
  }
  return response.json();
}; 