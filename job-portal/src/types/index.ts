export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  salary: string;
  status: 'active' | 'closed' | 'draft';
  posted_date: string;
  passport_required?: boolean;
};

export type JobCreate = {
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  salary: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string;
  has_passport?: boolean;
  passport_number?: string | null;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_date: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'user';
}; 