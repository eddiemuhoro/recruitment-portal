import React from 'react';
import AIChat from '../components/AIChat';
import AIJobRecommendations from '../components/AIJobRecommendations';
import AISmartSearch from '../components/AISmartSearch';

const AIFeatures: React.FC = () => {
  const handleSearch = (query: string) => {
    // Implement your search logic here
    console.log('Searching with query:', query);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Features
          </h1>
          <p className="text-xl text-gray-600">
            Enhance your job search experience with our intelligent AI features
          </p>
        </div>

        <div className="space-y-12">
          {/* Smart Search Section */}
          {/* <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Smart Search
            </h2>
            <p className="text-gray-600 mb-6">
              Use natural language to search for jobs. Our AI will understand your intent and find the most relevant positions.
            </p>
            <AISmartSearch onSearch={handleSearch} />
          </section> */}

          {/* AI Chat Assistant Section */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              AI Chat Assistant
            </h2>
            <p className="text-gray-600 mb-6">
              Get instant answers to your questions about jobs, company culture, and application processes.
            </p>
            <AIChat />
          </section>

          {/* Job Recommendations Section */}
          <section className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Personalized Job Recommendations
            </h2>
            <p className="text-gray-600 mb-6">
              Tell us about your experience and preferences, and our AI will suggest the most suitable job opportunities.
            </p>
            <AIJobRecommendations />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AIFeatures; 