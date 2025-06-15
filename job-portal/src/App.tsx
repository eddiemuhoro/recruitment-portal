import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import Services from './pages/Services';
import JobList from './components/jobs/JobList';
import Contact from './pages/Contact';
import Partner from './pages/Partner';
import JobApplicationFormWrapper from './components/application/JobApplicationFormWrapper.tsx';
import AdminDashboard from './components/admin/AdminDashboard';
import { useState } from 'react';
import type { JobApplication } from './types';

function App() {
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const handleApplicationStatusChange = (applicationId: string, status: string) => {
    setApplications(prevApplications =>
      prevApplications.map(app =>
        app.id === applicationId ? { ...app, status: status as JobApplication['status'] } : app
      )
    );
  };

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Services />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/partner" element={<Partner />} />
            <Route
              path="/jobs/:job_id/apply"
              element={<JobApplicationFormWrapper />}
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard
                    onApplicationStatusChange={handleApplicationStatusChange}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
