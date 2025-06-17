import React, { useState } from 'react';
import { enhanceSearchQuery } from '../api/openai';

interface AISmartSearchProps {
  onSearch: (query: string) => void;
}

const AISmartSearch: React.FC<AISmartSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedQuery, setEnhancedQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsEnhancing(true);
    try {
      const enhanced = await enhanceSearchQuery(query);
      setEnhancedQuery(enhanced || query);
      onSearch(enhanced || query);
    } catch (error) {
      console.error('Error enhancing search query:', error);
      onSearch(query);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs (e.g., 'Looking for remote software developer jobs in New York')"
            className="w-full p-4 pr-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isEnhancing}
          />
          <button
            type="submit"
            disabled={isEnhancing}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isEnhancing ? 'Enhancing...' : 'Search'}
          </button>
        </div>
      </form>

      {enhancedQuery && enhancedQuery !== query && (
        <div className="mt-2 text-sm text-gray-600">
          <p>Enhanced search: "{enhancedQuery}"</p>
        </div>
      )}
    </div>
  );
};

export default AISmartSearch; 