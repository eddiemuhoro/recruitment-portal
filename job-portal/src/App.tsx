import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import JobList from './components/JobList';
import JobApplicationForm from './components/JobApplicationForm';
import AdminDashboard from './components/AdminDashboard';
import { mockJobs, mockApplications } from './data/mockData';
import { useState, useEffect } from 'react';
import type { Job, JobApplication } from './types';
import { fetchJobById } from './api/jobs';

function JobApplicationFormWrapper() {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJob = async () => {
      try {
        if (job_id) {
          const data = await fetchJobById(job_id);
          setJob(data);
        }
      } catch (err) {
        setError('Failed to load job');
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [job_id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!job) return <div>Job not found</div>;

  return <JobApplicationForm job={job} />;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);

  const handleJobStatusChange = (job_id: string, status: string) => {
    setJobs(jobs.map(job => 
      job.id === job_id ? { ...job, status: status as Job['status'] } : job
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
      job_id: formData.get('job_id') as string,
      applicant_name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      cv_url: URL.createObjectURL(formData.get('cv') as File),
      cover_letter: formData.get('cover_letter') as string,
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
            path="/jobs/:job_id/apply"
            element={<JobApplicationFormWrapper />}
          />
          <Route
            path="/dashboard"
            element={
              <AdminDashboard
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
