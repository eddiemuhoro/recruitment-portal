import { useState, useEffect } from 'react';
import type { Job } from '../../types';

interface JobFormProps {
  initialData?: Job;
  onSubmit: (jobData: Omit<Job, 'id'>) => Promise<void>;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const JobForm = ({ initialData, onSubmit, onCancel, isEditing }: JobFormProps) => {
  const [isFormVisible, setIsFormVisible] = useState(isEditing || false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employer_id: 1,
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    status: 'draft' as Job['status'],
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        company: initialData.company,
        location: initialData.location,
        employer_id: initialData.employer_id,
        type: initialData.type,
        description: initialData.description,
        requirements: initialData.requirements.join(', '),
        salary: initialData.salary,
        status: initialData.status,
      });
      setIsFormVisible(true);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      type: formData.type as Job['type'],
      requirements: formData.requirements.split(',').map(req => req.trim()),
      posted_date: new Date().toISOString(),
      status: formData.status as Job['status'],
    });
    handleClose();
  };

  const handleClose = () => {
    setIsFormVisible(false);
    if (!isEditing) {
      setFormData({
        title: '',
        company: '',
        location: '',
        employer_id: 1,
        type: 'Full-time',
        description: '',
        requirements: '',
        salary: '',
        status: 'draft',
      });
    }
    onCancel?.();
  };

  if (!isFormVisible && !isEditing) {
    return (
      <button
        onClick={() => setIsFormVisible(true)}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add New Job
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 space-y-4 max-w-xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{initialData ? 'Edit Job' : 'Add New Job'}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company:</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location:</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type:</label>
            <select name="type" value={formData.type} onChange={handleChange} required className="input-field w-full">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
            <select name="status" value={formData.status} onChange={handleChange} required className="input-field w-full">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Requirements (comma-separated):</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salary:</label>
            <input type="text" name="salary" value={formData.salary} onChange={handleChange} required className="input-field w-full" />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="btn-primary flex-1">
              {initialData ? 'Update Job' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 