import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import JobsPage from "./pages/JobsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import InquiriesPage from "./pages/InquiriesPage";
import ContactInquiriesPage from "./pages/ContactInquiriesPage";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/inquiries" element={<InquiriesPage />} />
            <Route
              path="/contact-inquiries"
              element={<ContactInquiriesPage />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
