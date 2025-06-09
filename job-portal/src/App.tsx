import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import JobList from './components/JobList';
import JobApplicationForm from './components/JobApplicationForm';
import AdminDashboard from './components/AdminDashboard';
import { mockJobs, mockApplications } from './data/mockData';
import { useState } from 'react';
import type { Job, JobApplication } from './types';

function App() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);

  const handleJobStatusChange = (jobId: string, status: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: status as Job['status'] } : job
    ));
  };

  const handleApplicationStatusChange = (applicationId: string, status: string) => {
    setApplications(applications.map(application =>
      application.id === applicationId ? { ...application, status: status as JobApplication['status'] } : application
    ));
  };

  const handleJobApplication = (formData: FormData) => {
    // In a real application, this would be an API call
    const newApplication: JobApplication = {
      id: Date.now().toString(),
      jobId: formData.get('jobId') as string,
      applicantName: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cvUrl: URL.createObjectURL(formData.get('cv') as File),
      coverLetter: formData.get('coverLetter') as string,
      status: 'pending',
      appliedDate: new Date().toISOString(),
    };
    setApplications([...applications, newApplication]);
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/jobs" element={<JobList />} />
          <Route
            path="/jobs/:jobId/apply"
            element={
              <JobApplicationForm
                job={jobs[0]} // In a real app, fetch the job by ID
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <AdminDashboard
                jobs={jobs}
                applications={applications}
                onJobStatusChange={handleJobStatusChange}
                onApplicationStatusChange={handleApplicationStatusChange}
              />
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
