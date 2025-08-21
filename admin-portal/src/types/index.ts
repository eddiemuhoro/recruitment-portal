export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  employer_id: number;
  posted_date: string;
  status: "active" | "closed";
  passport_required?: boolean;
  required_documents?: DocumentType[];
}

export interface JobCreate {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  salary: string;
  employer_id: number;
  status: "active" | "closed";
  passport_required?: boolean;
  required_documents?: DocumentType[];
}

export type DocumentType =
  | "cv"
  | "passport"
  | "birth_certificate"
  | "kcse_certificate"
  | "kcpe_certificate"
  | "certificate_of_good_conduct"
  | "academic_transcripts"
  | "professional_certificate"
  | "work_permit"
  | "police_clearance"
  | "medical_certificate"
  | "other";

export interface ApplicationDocument {
  id: number;
  document_type: DocumentType;
  document_url: string;
  document_name: string;
  uploaded_at: string;
}

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter: string;
  passport_number?: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  applied_date: string;
  ai_score?: number;
  skills?: string[];
  documents: ApplicationDocument[];
};

export type InquiryStatus = "new" | "in_progress" | "resolved" | "closed";
export type Priority = "low" | "medium" | "high" | "urgent";

export interface EmployerInquiry {
  id: string;
  agency_id: number;
  employer_name: string;
  contact_email: string;
  phone_number: string | null;
  message: string;
  is_urgent: boolean;
  status: InquiryStatus;
  priority: Priority;
  admin_notes?: string;
  admin_response?: string;
  assigned_to?: string;
  responded_at?: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployerInquiryUpdate {
  status?: InquiryStatus;
  priority?: Priority;
  admin_notes?: string;
  admin_response?: string;
  assigned_to?: string;
}

export interface InquiryStats {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  urgent: number;
}

export interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
  response: string | null;
  responded_at: string | null;
}

export interface ContactInquiryUpdate {
  is_read?: boolean;
  response?: string;
}
