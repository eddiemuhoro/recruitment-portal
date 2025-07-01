import { useState, useEffect } from 'react';
import type { Job, JobCreate, DocumentType } from '../../types';

interface JobFormProps {
  job?: Job;
  onSubmit: (jobData: JobCreate) => Promise<void>;
  onCancel: () => void;
}

export default function JobForm({ job, onSubmit, onCancel }: JobFormProps) {
  const [formData, setFormData] = useState<JobCreate>({
    title: '',
    company: '',
    location: '',
    type: '',
    description: '',
    requirements: [''],
    salary: '',
    status: 'active',
    employer_id: 1, // Default employer_id for admin
    passport_required: false,
    required_documents: ['cv']
  });

  useEffect(() => {
    if (job) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, posted_date, ...jobData } = job;
      setFormData(jobData);
    }
  }, [job]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((req, i) =>
        i === index ? value : req
      ),
    }));
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ''],
    }));
  };

  const removeRequirement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handlePassportRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, passport_required: e.target.checked }));
  };

  const handleRequiredDocumentChange = (document: DocumentType, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      required_documents: checked
        ? [...(prev.required_documents || []), document]
        : (prev.required_documents || []).filter(doc => doc !== document)
    }));
  };

  const documentTypes: DocumentType[] = ['cv', 'passport', 'birth_certificate', 'kcse_certificate', 'kcpe_certificate', 'certificate_of_good_conduct', 'academic_transcripts', 'professional_certificate', 'work_permit', 'police_clearance', 'medical_certificate', 'other'];

  const getDocumentTypeLabel = (docType: DocumentType): string => {
    const labels: Record<DocumentType, string> = {
      cv: 'CV/Resume',
      passport: 'Passport',
      birth_certificate: 'Birth Certificate',
      kcse_certificate: 'KCSE Certificate',
      kcpe_certificate: 'KCPE Certificate',
      certificate_of_good_conduct: 'Certificate of Good Conduct',
      academic_transcripts: 'Academic Transcripts',
      professional_certificate: 'Professional Certificate',
      work_permit: 'Work Permit',
      police_clearance: 'Police Clearance',
      medical_certificate: 'Medical Certificate',
      other: 'Other Documents'
    };
    return labels[docType] || docType;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure employer_id is set to 1 before submission
    const jobData = {
      ...formData,
      employer_id: 1
    };
    await onSubmit(jobData);
  };

  const inputClasses = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 px-4 py-2.5";
  const selectClasses = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 px-4 py-2.5";
  const textareaClasses = "mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 px-4 py-2.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Job Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={formData.title}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter job title"
          />
        </div>

        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            value={formData.company}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter company name"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            required
            value={formData.location}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter job location"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-gray-700"
          >
            Job Type
          </label>
          <select
            name="type"
            id="type"
            required
            value={formData.type}
            onChange={handleChange}
            className={selectClasses}
          >
            <option value="">Select a type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary
          </label>
          <input
            type="text"
            name="salary"
            id="salary"
            required
            value={formData.salary}
            onChange={handleChange}
            className={inputClasses}
            placeholder="Enter salary range"
          />
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            name="status"
            id="status"
            required
            value={formData.status}
            onChange={handleChange}
            className={selectClasses}
          >
            <option value="active">Active</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          name="description"
          id="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          className={textareaClasses}
          placeholder="Enter job description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Requirements
        </label>
        <div className="mt-2 space-y-2">
          {formData.requirements.map((requirement, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={requirement}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                required
                className={inputClasses}
                placeholder="Enter requirement"
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="inline-flex items-center px-3 py-2 border-2 border-red-200 text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="inline-flex items-center px-3 py-2 border-2 border-blue-200 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            Add Requirement
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center">
          <input
            id="passport_required"
            name="passport_required"
            type="checkbox"
            checked={formData.passport_required}
            onChange={handlePassportRequiredChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="passport_required" className="ml-2 block text-sm font-medium text-gray-700">
            Passport Required
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Required Documents
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {documentTypes.map((docType) => (
            <div key={docType} className="flex items-center">
              <input
                id={`doc_${docType}`}
                name="required_documents"
                type="checkbox"
                checked={formData.required_documents?.includes(docType) || false}
                onChange={(e) => handleRequiredDocumentChange(docType, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor={`doc_${docType}`} className="ml-2 block text-sm text-gray-700">
                {getDocumentTypeLabel(docType)}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-4 py-2 border-2 border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border-2 border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          {job ? 'Update Job' : 'Create Job'}
        </button>
      </div>
    </form>
  );
} 