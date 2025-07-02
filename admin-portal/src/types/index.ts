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

export interface EmployerInquiry {
  id: string;
  agency_id: number;
  employer_name: string;
  contact_email: string;
  phone_number: string | null;
  message: string;
  is_urgent: boolean;
  created_at: string;
}
