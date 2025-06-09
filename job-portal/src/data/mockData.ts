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
    postedDate: '2024-03-15',
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
    postedDate: '2024-03-14',
  },
];

export const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    applicantName: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    cvUrl: '/cvs/john-doe-cv.pdf',
    coverLetter: 'I am excited to apply for this position...',
    status: 'pending',
    appliedDate: '2024-03-16',
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