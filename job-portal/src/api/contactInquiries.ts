import { API_CONFIG } from "./config";

export interface ContactInquiryCreate {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ContactInquiry extends ContactInquiryCreate {
  id: number;
  created_at: string;
  is_read: boolean;
  response: string | null;
  responded_at: string | null;
}

export async function createContactInquiry(
  inquiry: ContactInquiryCreate
): Promise<ContactInquiry> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inquiry),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to submit contact inquiry: ${errorText}`);
  }

  return response.json();
}

export async function getContactInquiries(): Promise<ContactInquiry[]> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contact inquiries");
  }

  return response.json();
}
