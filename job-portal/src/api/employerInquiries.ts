import { API_CONFIG } from './config';

interface EmployerInquiry {
  id?: number; // Optional as it's auto-generated
  agency_id: number;
  employer_name: string;
  message: string;
  contact_email: string;
  created_at?: string; // Optional as it's auto-generated
}

export const submitEmployerInquiry = async (inquiry: Omit<EmployerInquiry, 'id' | 'created_at'>) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMPLOYER_INQUIRIES.BASE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...inquiry,
        agency_id: 1 // Default agency ID
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit inquiry');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting employer inquiry:', error);
    throw error;
  }
}; 