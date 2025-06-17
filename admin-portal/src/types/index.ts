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
  status: 'active' | 'closed';
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
  status: 'active' | 'closed';
}

export interface JobApplication {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_date: string;
  ai_score?: number;
  skills?: string[];
}

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