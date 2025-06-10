export type JobApplication = {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
}; 