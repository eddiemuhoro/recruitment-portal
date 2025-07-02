import type { ContactInquiry, ContactInquiryUpdate } from "../types";
import { API_CONFIG } from "./config";

export async function getContactInquiries(
  skip = 0,
  limit = 100,
  isRead?: boolean
): Promise<ContactInquiry[]> {
  const params = new URLSearchParams({
    skip: skip.toString(),
    limit: limit.toString(),
  });
  
  if (isRead !== undefined) {
    params.append('is_read', isRead.toString());
  }

  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}?${params}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contact inquiries");
  }

  return response.json();
}

export async function getContactInquiry(id: number): Promise<ContactInquiry> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}/${id}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch contact inquiry");
  }

  return response.json();
}

export async function updateContactInquiry(
  id: number,
  update: ContactInquiryUpdate
): Promise<ContactInquiry> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(update),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update contact inquiry");
  }

  return response.json();
}

export async function deleteContactInquiry(id: number): Promise<void> {
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CONTACT_INQUIRIES.BASE}/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete contact inquiry");
  }
}
