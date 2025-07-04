import { useState, useMemo } from "react";
import type { Job } from "../../types";
import { Link } from "react-router-dom";
import { getJobs } from "../../api/jobs";
import JobDetailsModal from "./JobDetailsModal";
import { useQuery } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 10;

export default function JobList() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [status, setStatus] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [company, setCompany] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: getJobs,
    select: (data) => data.filter((job) => job.status !== "draft"),
  });

  // Get unique values for dropdowns
  const locations = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.location).filter(Boolean))),
    [jobs]
  );
  const jobTypes = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.type).filter(Boolean))),
    [jobs]
  );
  const companies = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.company).filter(Boolean))),
    [jobs]
  );

  // Filtering logic
  const filteredJobs = useMemo(() => {
    let filtered = jobs;
    if (keyword.trim()) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(kw) ||
          j.company.toLowerCase().includes(kw) ||
          j.description.toLowerCase().includes(kw)
      );
    }
    if (location) filtered = filtered.filter((j) => j.location === location);
    if (jobType) filtered = filtered.filter((j) => j.type === jobType);
    if (status) filtered = filtered.filter((j) => j.status === status);
    if (company) filtered = filtered.filter((j) => j.company === company);
    if (salaryMin)
      filtered = filtered.filter(
        (j) => parseInt(j.salary.replace(/\D/g, "")) >= parseInt(salaryMin)
      );
    if (salaryMax)
      filtered = filtered.filter(
        (j) => parseInt(j.salary.replace(/\D/g, "")) <= parseInt(salaryMax)
      );
    // Sorting
    if (sortBy === "newest")
      filtered = filtered
        .slice()
        .sort((a, b) =>
          b.createdAt && a.createdAt
            ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            : 0
        );
    if (sortBy === "oldest")
      filtered = filtered
        .slice()
        .sort((a, b) =>
          a.createdAt && b.createdAt
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : 0
        );
    if (sortBy === "salaryHigh")
      filtered = filtered
        .slice()
        .sort(
          (a, b) =>
            parseInt(b.salary.replace(/\D/g, "")) -
            parseInt(a.salary.replace(/\D/g, ""))
        );
    if (sortBy === "salaryLow")
      filtered = filtered
        .slice()
        .sort(
          (a, b) =>
            parseInt(a.salary.replace(/\D/g, "")) -
            parseInt(b.salary.replace(/\D/g, ""))
        );
    return filtered;
  }, [
    jobs,
    keyword,
    location,
    jobType,
    status,
    company,
    salaryMin,
    salaryMax,
    sortBy,
  ]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const getStatusBadge = (status: Job["status"]) => {
    switch (status) {
      case "active":
        return (
          <span className="px-2.5 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            Active
          </span>
        );
      case "closed":
        return (
          <span className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-50 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full"></span>
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  // Reset filters
  const resetFilters = () => {
    setKeyword("");
    setLocation("");
    setJobType("");
    setStatus("");
    setSalaryMin("");
    setSalaryMax("");
    setCompany("");
    setSortBy("newest");
  };

  const [showFilters, setShowFilters] = useState(false);

  // Filter controls as a component for reuse
  const FilterControls = (
    <>
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Keyword
        </label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search jobs, companies..."
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Location
        </label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Job Type
        </label>
        <select
          value={jobType}
          onChange={(e) => setJobType(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[120px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="min-w-[120px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Company
        </label>
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">All</option>
          {companies.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[120px] flex gap-2">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Min Salary
          </label>
          <input
            type="number"
            value={salaryMin}
            onChange={(e) => setSalaryMin(e.target.value)}
            placeholder="Min"
            className="w-full p-2 border rounded-md"
            min={0}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Max Salary
          </label>
          <input
            type="number"
            value={salaryMax}
            onChange={(e) => setSalaryMax(e.target.value)}
            placeholder="Max"
            className="w-full p-2 border rounded-md"
            min={0}
          />
        </div>
      </div>
      <div className="min-w-[140px]">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Sort By
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="salaryHigh">Salary: High to Low</option>
          <option value="salaryLow">Salary: Low to High</option>
        </select>
      </div>
      <button
        onClick={resetFilters}
        className="ml-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-md border border-gray-200 hover:bg-gray-200 transition-colors text-sm"
        type="button"
      >
        Reset
      </button>
    </>
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg">
        {error instanceof Error ? error.message : "Failed to load jobs"}
      </div>
    );

  if (jobs.length === 0)
    return (
      <div className="text-center text-gray-600 p-8 bg-gray-50 rounded-lg">
        No jobs available at the moment.
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Desktop Filter Bar */}
      <div className="hidden md:flex bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex-wrap gap-4 items-end">
        {FilterControls}
      </div>
      {/* Mobile Filter Button */}
      <div className="flex md:hidden justify-end mb-2">
        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
        >
          Filter
        </button>
      </div>
      {/* Mobile Filter Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl p-6 w-[95vw] max-w-md shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 text-2xl"
              onClick={() => setShowFilters(false)}
              aria-label="Close filter modal"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Filter Jobs</h3>
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setShowFilters(false);
              }}
            >
              {FilterControls}
              <button
                type="submit"
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md font-medium"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 ${
              job.status === "closed" ? "opacity-75" : "cursor-pointer"
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                    {job.title}
                  </h2>
                  <p className="text-sm text-gray-600">{job.company}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full">
                    {job.type}
                  </span>
                  {getStatusBadge(job.status)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {job.location}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Salary:</span> {job.salary}
                </div>
              </div>

              <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                {job.description}
              </p>

              <div className="mb-4" onClick={() => setSelectedJob(job)}>
                <h3 className="text-xs font-medium text-gray-900 mb-2">
                  Key Requirements:
                </h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  {job.requirements
                    .slice(0, 2)
                    .map((req: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-500 mr-1">•</span>
                        <span className="line-clamp-1">{req}</span>
                      </li>
                    ))}
                  {job.requirements.length > 2 && (
                    <li className="text-blue-600 text-xs">
                      +{job.requirements.length - 2} more
                    </li>
                  )}
                </ul>
              </div>

              <div className="mt-4">
                {job.status === "closed" ? (
                  <div className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-500 rounded-lg">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                    Applications Closed
                  </div>
                ) : (
                  <Link
                    to={`/jobs/${job.id}/apply`}
                    className="block w-full text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
}
