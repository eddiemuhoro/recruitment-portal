import { useState } from 'react';
import type { Job } from '../../types';
import { uploadFile } from '../../utils/firebase';

interface JobApplicationFormProps {
  job: Job;
  onSubmit: (formData: FormData) => void;
}

export default function JobApplicationForm({ job, onSubmit }: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cover_letter: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      setIsUploading(true);
      setUploadError(null);
      
      const cvFile = formData.get('cv') as File;
      if (cvFile) {
        const cvUrl = await uploadFile(cvFile);
        formData.set('cv_url', cvUrl);
      }
      
      onSubmit(formData);
    } catch (error) {
      setUploadError('Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow rounded-lg p-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Apply for {job.title}</h2>
        <p className="mt-1 text-gray-600">{job.company}</p>
      </div>

      {uploadError && <div className="text-red-500">{uploadError}</div>}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="input-field mt-1"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="input-field mt-1"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="input-field mt-1"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="cover_letter" className="block text-sm font-medium text-gray-700">
          Cover Letter
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={6}
          required
          className="input-field mt-1"
          value={formData.cover_letter}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="cv" className="block text-sm font-medium text-gray-700">
          CV/Resume
        </label>
        <input
          type="file"
          id="cv"
          name="cv"
          accept=".pdf,.doc,.docx"
          required
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div>
        <button type="submit" className="btn-primary w-full" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Submit Application'}
        </button>
      </div>
    </form>
  );
} 