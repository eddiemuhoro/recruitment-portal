import type { EmployerInquiry } from '../types';
import { API_CONFIG } from './config';
import { apiClient } from './client';

export async function getEmployerInquiries(): Promise<EmployerInquiry[]> {
  return apiClient<EmployerInquiry[]>(API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE);
}

export async function updateInquiryStatus(
  inquiryId: string,
  isUrgent: boolean
): Promise<EmployerInquiry> {
  return apiClient<EmployerInquiry>(
    `${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/${inquiryId}/status`,
    {
      method: 'PUT',
      body: JSON.stringify({ is_urgent: isUrgent }),
    }
  );
} 