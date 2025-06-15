import { API_CONFIG } from './config';
import type { EmployerInquiry } from '../types';

export async function getEmployerInquiries(): Promise<EmployerInquiry[]> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}`);
  if (!response.ok) {
    throw new Error('Failed to fetch inquiries');
  }
  return response.json();
}

export async function submitEmployerInquiry(inquiry: Omit<EmployerInquiry, 'id' | 'created_at'>): Promise<EmployerInquiry> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(inquiry),
  });
  if (!response.ok) {
    throw new Error('Failed to submit inquiry');
  }
  return response.json();
}

export async function getEmployerInquiryById(id: number): Promise<EmployerInquiry> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch inquiry');
  }
  return response.json();
} 