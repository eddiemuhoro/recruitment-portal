import type {
  JobApplication,
  JobApplicationCreate,
  DocumentType,
} from "../types";
import { API_CONFIG } from "./config";

export const fetchApplications = async (): Promise<JobApplication[]> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  return response.json();
};

export const fetchApplicationById = async (
  id: string
): Promise<JobApplication> => {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}/${id}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch application");
  }
  return response.json();
};

export async function getApplications(): Promise<JobApplication[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch applications");
  }
  return response.json();
}

export async function createApplication(
  application: JobApplicationCreate
): Promise<JobApplication> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.BASE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(application),
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to create application");
  }
  return response.json();
}

export async function updateApplicationStatus(
  applicationId: string,
  status: JobApplication["status"]
): Promise<void> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.APPLICATIONS.STATUS(
      applicationId
    )}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update application status");
  }
}

// New functions for document management
export async function getJobDocumentRequirements(
  jobId: string
): Promise<{ job_id: number; required_documents: DocumentType[] }> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.JOBS.DOCUMENT_REQUIREMENTS(
      jobId
    )}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch job document requirements");
  }
  return response.json();
}

export async function getAvailableDocumentTypes(): Promise<{
  document_types: { value: DocumentType; label: string }[];
}> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.DOCUMENTS.TYPES}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch document types");
  }
  return response.json();
}
