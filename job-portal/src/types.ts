export type JobCreate = Omit<Job, "id" | "postedDate">;

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employer" | "applicant";
};

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

export type ApplicationDocument = {
  id?: number;
  document_type: DocumentType;
  document_url: string;
  document_name: string;
  uploaded_at?: string;
};

export type Job = {
  id: string;
  title: string;
  createdAt: string;
  company: string;
  location: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  description: string;
  requirements: string[];
  salary: string;
  status: "active" | "closed" | "draft";
  passport_required?: boolean;
  required_documents?: DocumentType[];
  employer_id: number;
  posted_date: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter?: string | null;
  passport_number?: string | null;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  applied_date: string;
  documents: ApplicationDocument[];
};

export type JobApplicationCreate = {
  job_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter?: string;
  passport_number?: string;
  documents: Omit<ApplicationDocument, "id" | "uploaded_at">[];
};

export type EmployerInquiry = {
  id: number;
  agency_id: number;
  employer_name: string;
  message: string;
  contact_email: string;
  phone_number?: string;
  is_urgent: boolean;
  created_at: string;
};
