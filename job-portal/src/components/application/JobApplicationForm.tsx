import { useState, useEffect } from "react";
import type {
  Job,
  DocumentType,
  ApplicationDocument,
  JobApplicationCreate,
} from "../../types";
import { uploadFile } from "../../utils/firebase";
import {
  getJobDocumentRequirements,
  getAvailableDocumentTypes,
} from "../../api/applications";

interface JobApplicationFormProps {
  job: Job;
  onSubmit: (applicationData: JobApplicationCreate) => void;
}

interface DocumentUpload {
  document_type: DocumentType;
  file: File | null;
  document_url: string;
  document_name: string;
  isUploading: boolean;
  error: string | null;
  isRequired: boolean;
}

export default function JobApplicationForm({
  job,
  onSubmit,
}: JobApplicationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cover_letter: "",
    passport_number: "",
  });

  const [requiredDocuments, setRequiredDocuments] = useState<DocumentType[]>(
    []
  );
  const [availableDocTypes, setAvailableDocTypes] = useState<
    { value: DocumentType; label: string }[]
  >([]);
  const [documents, setDocuments] = useState<DocumentUpload[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const loadRequirements = async () => {
      try {
        // Get required documents for this job
        const requirements = await getJobDocumentRequirements(job.id);
        const docTypes = await getAvailableDocumentTypes();

        setRequiredDocuments(requirements.required_documents);
        setAvailableDocTypes(docTypes.document_types);

        // Initialize document uploads for required documents
        const initialDocs: DocumentUpload[] =
          requirements.required_documents.map((docType) => ({
            document_type: docType,
            file: null,
            document_url: "",
            document_name: "",
            isUploading: false,
            error: null,
            isRequired: true,
          }));

        setDocuments(initialDocs);
      } catch (error) {
        console.error("Failed to load document requirements:", error);
        // Fallback to CV only
        setRequiredDocuments(["cv"]);
        setDocuments([
          {
            document_type: "cv",
            file: null,
            document_url: "",
            document_name: "",
            isUploading: false,
            error: null,
            isRequired: true,
          },
        ]);
      }
    };

    loadRequirements();
  }, [job.id]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      if (!validateEmail(value)) {
        setEmailError(
          "Please enter a valid email address (e.g., user@domain.com)"
        );
      } else {
        setEmailError(null);
      }
    }
  };

  const handleFileChange = (documentType: DocumentType, file: File | null) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.document_type === documentType
          ? { ...doc, file, document_name: file?.name || "", error: null }
          : doc
      )
    );
  };

  const addOptionalDocument = () => {
    // Find available document types that aren't already added
    const usedDocTypes = documents.map((doc) => doc.document_type);
    const availableTypes = availableDocTypes.filter(
      (docType) => !usedDocTypes.includes(docType.value)
    );

    if (availableTypes.length > 0) {
      const newDoc: DocumentUpload = {
        document_type: availableTypes[0].value,
        file: null,
        document_url: "",
        document_name: "",
        isUploading: false,
        error: null,
        isRequired: false,
      };
      setDocuments((prev) => [...prev, newDoc]);
    }
  };

  const removeOptionalDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDocumentTypeChange = (index: number, newType: DocumentType) => {
    setDocuments((prev) =>
      prev.map((doc, i) =>
        i === index
          ? {
              ...doc,
              document_type: newType,
              file: null,
              document_url: "",
              document_name: "",
              error: null,
            }
          : doc
      )
    );
  };

  const uploadDocument = async (docIndex: number): Promise<string> => {
    const doc = documents[docIndex];
    if (!doc.file) throw new Error("No file selected");

    // Update uploading state
    setDocuments((prev) =>
      prev.map((d, i) =>
        i === docIndex ? { ...d, isUploading: true, error: null } : d
      )
    );

    try {
      const url = await uploadFile(doc.file);

      // Update with success
      setDocuments((prev) =>
        prev.map((d, i) =>
          i === docIndex ? { ...d, document_url: url, isUploading: false } : d
        )
      );

      return url;
    } catch (error) {
      // Update with error
      setDocuments((prev) =>
        prev.map((d, i) =>
          i === docIndex
            ? { ...d, isUploading: false, error: "Upload failed" }
            : d
        )
      );
      throw error;
    }
  };

  const getDocumentLabel = (docType: DocumentType): string => {
    const found = availableDocTypes.find((dt) => dt.value === docType);
    return (
      found?.label ||
      docType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (emailError) {
      setFormError("Please fix the email format before submitting");
      return;
    }

    if (job.passport_required && !formData.passport_number) {
      setFormError("Please enter your passport number for this position.");
      return;
    }

    // Check if all required documents have files
    const missingDocs = documents.filter((doc) => doc.isRequired && !doc.file);
    if (missingDocs.length > 0) {
      setFormError(
        `Please upload the following required documents: ${missingDocs
          .map((d) => getDocumentLabel(d.document_type))
          .join(", ")}`
      );
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      // Upload all documents that have files
      const uploadedDocuments: ApplicationDocument[] = [];

      for (let i = 0; i < documents.length; i++) {
        const doc = documents[i];
        if (doc.file) {
          const url = await uploadDocument(i);
          uploadedDocuments.push({
            document_type: doc.document_type,
            document_url: url,
            document_name: doc.file.name,
          });
        }
      }

      // Prepare application data
      const applicationData: JobApplicationCreate = {
        job_id: parseInt(job.id),
        applicant_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cover_letter: formData.cover_letter || undefined,
        passport_number: formData.passport_number || undefined,
        documents: uploadedDocuments,
      };

      await onSubmit(applicationData);
    } catch (error) {
      console.error("Error submitting application:", error);
      setFormError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white shadow rounded-lg p-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Apply for {job.title}
        </h2>
        <p className="mt-1 text-gray-600">{job.company}</p>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {formError}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
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
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className={`input-field mt-1 ${emailError ? "border-red-500" : ""}`}
          value={formData.email}
          onChange={handleChange}
        />
        {emailError && (
          <p className="mt-1 text-sm text-red-500">{emailError}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
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

      {job.passport_required && (
        <div>
          <label
            htmlFor="passport_number"
            className="block text-sm font-medium text-gray-700"
          >
            Passport Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="passport_number"
            name="passport_number"
            required={job.passport_required}
            className="input-field mt-1"
            value={formData.passport_number}
            onChange={handleChange}
            placeholder="Required for this position"
          />
        </div>
      )}

      <div>
        <label
          htmlFor="cover_letter"
          className="block text-sm font-medium text-gray-700"
        >
          Cover Letter <span className="text-gray-500">(Optional)</span>
        </label>
        <textarea
          id="cover_letter"
          name="cover_letter"
          rows={4}
          className="input-field mt-1"
          value={formData.cover_letter}
          onChange={handleChange}
          placeholder="Tell us why you're interested in this position..."
        />
      </div>

      {/* Documents Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Required Documents
        </h3>
        <div className="space-y-4">
          {documents
            .filter((doc) => doc.isRequired)
            .map((doc, index) => {
              const actualIndex = documents.findIndex(
                (d) => d.document_type === doc.document_type && d.isRequired
              );
              return (
                <div
                  key={`required-${doc.document_type}`}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {getDocumentLabel(doc.document_type)}{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      handleFileChange(
                        doc.document_type,
                        e.target.files?.[0] || null
                      )
                    }
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  />

                  {doc.isUploading && (
                    <p className="mt-1 text-sm text-blue-600">Uploading...</p>
                  )}

                  {doc.error && (
                    <p className="mt-1 text-sm text-red-500">{doc.error}</p>
                  )}

                  {doc.document_name && !doc.isUploading && !doc.error && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ {doc.document_name}
                    </p>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Optional Documents Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Additional Documents
            <span className="text-sm text-gray-500 ml-2">(Optional)</span>
          </h3>
          <button
            type="button"
            onClick={addOptionalDocument}
            disabled={
              documents.filter((doc) => !doc.isRequired).length >=
              availableDocTypes.length - requiredDocuments.length
            }
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            + Add Document
          </button>
        </div>

        {documents.filter((doc) => !doc.isRequired).length > 0 && (
          <div className="space-y-4">
            {documents
              .map((doc, index) => ({ doc, index }))
              .filter(({ doc }) => !doc.isRequired)
              .map(({ doc, index }) => {
                const usedDocTypes = documents.map((d) => d.document_type);
                const availableForThisDoc = availableDocTypes.filter(
                  (dt) =>
                    dt.value === doc.document_type ||
                    !usedDocTypes.includes(dt.value)
                );

                return (
                  <div
                    key={`optional-${index}`}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Document Type
                        </label>
                        <select
                          value={doc.document_type}
                          onChange={(e) =>
                            handleDocumentTypeChange(
                              index,
                              e.target.value as DocumentType
                            )
                          }
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          {availableForThisDoc.map((docType) => (
                            <option key={docType.value} value={docType.value}>
                              {docType.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeOptionalDocument(index)}
                        className="ml-2 p-1 text-red-600 hover:text-red-800"
                        title="Remove document"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) =>
                        handleFileChange(
                          doc.document_type,
                          e.target.files?.[0] || null
                        )
                      }
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />

                    {doc.isUploading && (
                      <p className="mt-1 text-sm text-blue-600">Uploading...</p>
                    )}

                    {doc.error && (
                      <p className="mt-1 text-sm text-red-500">{doc.error}</p>
                    )}

                    {doc.document_name && !doc.isUploading && !doc.error && (
                      <p className="mt-1 text-sm text-green-600">
                        ✓ {doc.document_name}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}

        {documents.filter((doc) => !doc.isRequired).length === 0 && (
          <p className="text-sm text-gray-500 italic">
            You can add additional documents like certificates, references, or
            other supporting materials.
          </p>
        )}
      </div>

      <div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting Application..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
}
