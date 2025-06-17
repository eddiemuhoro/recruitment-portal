import React, { useState } from 'react';
import { generateJobRecommendations } from '../api/openai';
import { FaBriefcase, FaStar, FaCheck } from 'react-icons/fa';

interface JobRecommendation {
  title: string;
  company: string;
  location: string;
  matchScore: number;
  description: string;
  requirements: string[];
  benefits: string[];
}

const AIJobRecommendations: React.FC = () => {
  const [userProfile, setUserProfile] = useState('');
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Based on the following candidate profile, provide job recommendations in JSON format with the following structure:
      {
        "recommendations": [
          {
            "title": "Job Title",
            "company": "Company Name",
            "location": "Job Location",
            "matchScore": 85,
            "description": "Job Description",
            "requirements": ["Requirement 1", "Requirement 2"],
            "benefits": ["Benefit 1", "Benefit 2"]
          }
        ]
      }

      Candidate Profile: ${userProfile}

      Consider:
      1. Skills and experience match
      2. Industry preferences
      3. Location preferences
      4. Career goals
      5. Current market trends
      
      Provide 3-5 most relevant job recommendations.`;

      const response = await generateJobRecommendations(prompt);
      try {
        const parsedResponse = JSON.parse(response || '{"recommendations": []}');
        setRecommendations(parsedResponse.recommendations || []);
      } catch (error) {
        console.error('Error parsing recommendations:', error);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error getting recommendations:', error);
      setRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaBriefcase className="text-blue-600" />
        AI Job Recommendations
      </h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="profile" className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your experience and preferences
          </label>
          <textarea
            id="profile"
            value={userProfile}
            onChange={(e) => setUserProfile(e.target.value)}
            placeholder="Example: I have 5 years of experience in software development, specializing in React and Node.js. I'm looking for remote positions in the tech industry..."
            className="w-full h-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Recommendations...</span>
            </>
          ) : (
            <>
              <FaStar />
              <span>Get Recommendations</span>
            </>
          )}
        </button>
      </form>

      {recommendations.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Personalized Recommendations</h3>
          {recommendations.map((job, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-500 text-sm">{job.location}</p>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-400" />
                  <span>{job.matchScore}% Match</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{job.description}</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Requirements</h5>
                  <ul className="space-y-1">
                    {job.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <FaCheck className="text-green-500 text-sm" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Benefits</h5>
                  <ul className="space-y-1">
                    {job.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <FaCheck className="text-green-500 text-sm" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIJobRecommendations; 