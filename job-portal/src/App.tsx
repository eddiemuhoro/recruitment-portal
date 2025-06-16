import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import Home from './pages/Home.tsx';
import Candidates from './pages/Candidates';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
      retry: 1, // Only retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch when window regains focus
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/partner" element={<Partner />} />
              <Route path="/candidates" element={<Candidates />} />
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
    </QueryClientProvider>
  );
}

export default App;
