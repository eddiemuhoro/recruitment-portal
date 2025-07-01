import type { Job, JobCreate, DocumentType } from "../types";
import { API_CONFIG } from "./config";

export async function getJobs(): Promise<Job[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.BASE}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
}

export async function createJob(job: JobCreate): Promise<Job> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.BASE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to create job");
  }
  return response.json();
}

export async function updateJob(jobId: string, job: JobCreate): Promise<Job> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.BASE}/${jobId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update job");
  }
  return response.json();
}

export async function deleteJob(job_id: string): Promise<void> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.BASE}/${job_id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to delete job");
  }
}

export const fetchJobById = async (id: string): Promise<Job> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.BASE}/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch job");
  }
  return response.json();
};

// New functions for document requirements
export async function updateJobDocumentRequirements(
  jobId: string,
  requiredDocuments: DocumentType[]
): Promise<{ job_id: number; required_documents: DocumentType[] }> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.DOCUMENT_REQUIREMENTS(
      jobId
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requiredDocuments),
    }
  );
  if (!response.ok) {
    throw new Error("Failed to update job document requirements");
  }
  return response.json();
}
