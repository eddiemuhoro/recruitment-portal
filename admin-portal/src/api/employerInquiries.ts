import type { EmployerInquiry, EmployerInquiryUpdate, InquiryStats } from '../types';
import { API_CONFIG } from './config';
import { apiClient } from './client';

export interface InquiryFilters {
  status?: string;
  priority?: string;
  search?: string;
  assigned_to?: string;
  skip?: number;
  limit?: number;
}

export async function getEmployerInquiries(filters?: InquiryFilters): Promise<EmployerInquiry[]> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }
  
  const url = `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}${params.toString() ? `?${params.toString()}` : ''}`;
  return apiClient<EmployerInquiry[]>(url);
}

export async function updateEmployerInquiry(
  inquiryId: string,
  updateData: EmployerInquiryUpdate
): Promise<EmployerInquiry> {
  return apiClient<EmployerInquiry>(
    `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/${inquiryId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updateData),
    }
  );
}

export async function deleteEmployerInquiry(inquiryId: string): Promise<void> {
  return apiClient<void>(
    `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/${inquiryId}`,
    {
      method: 'DELETE',
    }
  );
}

export async function bulkUpdateInquiries(
  inquiryIds: string[],
  updateData: EmployerInquiryUpdate
): Promise<{ message: string; updated_count: number }> {
  return apiClient<{ message: string; updated_count: number }>(
    `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/bulk-update`,
    {
      method: 'POST',
      body: JSON.stringify({
        inquiry_ids: inquiryIds.map(id => parseInt(id)),
        ...updateData
      }),
    }
  );
}

export async function getInquiryStats(): Promise<InquiryStats> {
  return apiClient<InquiryStats>(
    `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/stats`
  );
}

// Legacy function for backward compatibility
export async function updateInquiryStatus(
  inquiryId: string,
  isUrgent: boolean
): Promise<EmployerInquiry> {
  return updateEmployerInquiry(inquiryId, { 
    priority: isUrgent ? 'urgent' : 'medium' 
  });
} 