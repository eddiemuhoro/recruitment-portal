import type { Job } from '../../types';

interface ApplicationFiltersProps {
  jobs: Job[];
  filters: {
    aiScoreRange: { min: number; max: number };
    dateRange: { start: string; end: string };
    selectedJob: string;
    skills: string;
  };
  onFilterChange: (filters: ApplicationFiltersProps['filters']) => void;
  onReset: () => void;
}

export default function ApplicationFilters({
  jobs,
  filters,
  onFilterChange,
  onReset,
}: ApplicationFiltersProps) {
  const handleChange = (
    field: keyof ApplicationFiltersProps['filters'],
    value: any
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Filter Applications</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Position
          </label>
          <select
            value={filters.selectedJob}
            onChange={(e) => handleChange('selectedJob', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">All Jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills Match
          </label>
          <input
            type="text"
            value={filters.skills}
            onChange={(e) => handleChange('skills', e.target.value)}
            placeholder="Search by skills..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Score Range
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="0"
              max="100"
              value={filters.aiScoreRange.min}
              onChange={(e) =>
                handleChange('aiScoreRange', {
                  ...filters.aiScoreRange,
                  min: parseInt(e.target.value),
                })
              }
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="number"
              min="0"
              max="100"
              value={filters.aiScoreRange.max}
              onChange={(e) =>
                handleChange('aiScoreRange', {
                  ...filters.aiScoreRange,
                  max: parseInt(e.target.value),
                })
              }
              className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) =>
                handleChange('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value,
                })
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) =>
                handleChange('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value,
                })
              }
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 