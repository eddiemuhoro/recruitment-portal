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

export const ApplicationFilters = ({
  jobs,
  filters,
  onFilterChange,
  onReset,
}: ApplicationFiltersProps) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AI Score Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              value={filters.aiScoreRange.min}
              onChange={(e) => onFilterChange({
                ...filters,
                aiScoreRange: { ...filters.aiScoreRange, min: parseInt(e.target.value) }
              })}
              className="input-field w-20"
              min="0"
              max="100"
            />
            <span>to</span>
            <input
              type="number"
              value={filters.aiScoreRange.max}
              onChange={(e) => onFilterChange({
                ...filters,
                aiScoreRange: { ...filters.aiScoreRange, max: parseInt(e.target.value) }
              })}
              className="input-field w-20"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={filters.dateRange.start}
              onChange={(e) => onFilterChange({
                ...filters,
                dateRange: { ...filters.dateRange, start: e.target.value }
              })}
              className="input-field"
            />
            <span>to</span>
            <input
              type="date"
              value={filters.dateRange.end}
              onChange={(e) => onFilterChange({
                ...filters,
                dateRange: { ...filters.dateRange, end: e.target.value }
              })}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Position</label>
          <select
            value={filters.selectedJob}
            onChange={(e) => onFilterChange({
              ...filters,
              selectedJob: e.target.value
            })}
            className="input-field w-full"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills/Keywords</label>
          <input
            type="text"
            value={filters.skills}
            onChange={(e) => onFilterChange({
              ...filters,
              skills: e.target.value
            })}
            placeholder="e.g., Mason, Maid, Care giver"
            className="input-field w-full"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={onReset}
            className="btn-secondary"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}; 