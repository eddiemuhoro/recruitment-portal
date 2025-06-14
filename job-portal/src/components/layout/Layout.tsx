import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">JobPortal</span>
              </Link>
              <div className="flex items-center space-x-4">
                <Link 
                  to="/jobs" 
                  className="text-gray-900 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 hover:text-blue-600"
                >
                  Jobs
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-900 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-50 hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </div>
            </div>
            {/* <div className="flex items-center">
              <Link 
                to="/login" 
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
            </div> */}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
} 