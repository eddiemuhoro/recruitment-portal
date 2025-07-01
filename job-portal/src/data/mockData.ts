import type { Job, JobApplication, User } from '../types';

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'New York, NY',
    type: 'Full-time',
    description: 'We are looking for an experienced React developer to join our team...',
    requirements: ['5+ years of React experience', 'TypeScript', 'Node.js'],
    salary: '$120,000 - $150,000',
    status: 'active',
    posted_date: '2024-03-15',
    employer_id: 1,
  },
  {
    id: '2',
    title: 'Frontend Developer',
    company: 'StartUp Inc',
    location: 'Remote',
    type: 'Remote',
    description: 'Join our fast-growing startup as a Frontend Developer...',
    requirements: ['3+ years of frontend development', 'React', 'CSS/SCSS'],
    salary: '$90,000 - $110,000',
    status: 'active',
    posted_date: '2024-03-14',
    employer_id: 2,
  },
];

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    job_id: '1',
    applicant_name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    cover_letter: 'I am excited to apply for this position...',
    status: 'pending',
    applied_date: '2024-03-16',
    documents: [
      {
        id: 1,
        document_type: 'cv',
        document_url: '/cvs/john-doe-cv.pdf',
        document_name: 'John Doe CV.pdf',
        uploaded_at: '2024-03-16T10:00:00Z'
      }
    ]
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Employer User',
    email: 'employer@example.com',
    role: 'employer',
  },
]; 