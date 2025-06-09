export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  description: string;
  requirements: string[];
  salary: string;
  postedDate: string;
  status?: 'active' | 'closed' | 'draft';
};

export type JobApplication = {
  id: string;
  jobId: string;
  applicantName: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  appliedDate: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employer' | 'user';
}; 