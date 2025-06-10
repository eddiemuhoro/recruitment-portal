import { useEffect, useState } from 'react';
import { Route, BrowserRouter as Router, Routes, useParams } from 'react-router-dom';
import { fetchJobById } from './api/jobs';
import AdminDashboard from './components/AdminDashboard';
import JobApplicationForm from './components/JobApplicationForm';
import JobList from './components/JobList';
import Layout from './components/Layout';
import { mockApplications } from './data/mockData';
import type { Job, JobApplication } from './types';

function JobApplicationFormWrapper() {
  const { job_id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleJobApplication = async (formData: FormData) => {
    try {
      const newApplication: JobApplication = {
        id: Date.now().toString(),
        job_id: job_id as string,
        applicant_name: formData.get('name') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        cv_url: formData.get('cv_url') as string,
        cover_letter: formData.get('cover_letter') as string,
        status: 'pending',
        applied_date: new Date().toISOString(),
      };
      
      const response = await fetch('http://localhost:8000/api/applications/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApplication),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      alert('Application submitted successfully!');
      window.location.href = '/jobs'; // Redirect to jobs list
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

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

  return <JobApplicationForm job={job} onSubmit={handleJobApplication} />;
}

function App() {
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);


  const handleApplicationStatusChange = (applicationId: string, status: string) => {
    setApplications(applications.map(application =>
      application.id === applicationId ? { ...application, status: status as JobApplication['status'] } : application
    ));
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
