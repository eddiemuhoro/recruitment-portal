export type JobCreate = Omit<Job, 'id' | 'postedDate'>;

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'applicant';
};

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
  employer_id: number;
  posted_date: string;
};

export type JobApplication = {
  id: string;
  job_id: string;
  applicant_name: string;
  email: string;
  phone: string;
  cv_url: string;
  cover_letter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_date: string;
}; 