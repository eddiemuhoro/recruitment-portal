# Flexible Document Upload System - Usage Guide

## Overview

The recruitment portal now supports flexible document requirements for job applications. Employers can specify which documents are required for each job, and applicants can upload multiple documents accordingly.

## Available Document Types

1. **cv** - Curriculum Vitae / Resume
2. **passport** - Passport Copy
3. **birth_certificate** - Birth Certificate
4. **kcse_certificate** - KCSE Certificate
5. **kcpe_certificate** - KCPE Certificate
6. **certificate_of_good_conduct** - Certificate of Good Conduct
7. **academic_transcripts** - Academic Transcripts
8. **professional_certificate** - Professional Certificates
9. **work_permit** - Work Permit
10. **police_clearance** - Police Clearance Certificate
11. **medical_certificate** - Medical Certificate
12. **other** - Other Documents

## API Endpoints

### 1. Get Available Document Types

```http
GET /api/document-types
```

Response:

```json
{
  "document_types": [
    { "value": "cv", "label": "Cv" },
    { "value": "passport", "label": "Passport" },
    { "value": "birth_certificate", "label": "Birth Certificate" }
    // ... more document types
  ]
}
```

### 2. Update Job Document Requirements

```http
PATCH /api/jobs/{job_id}/document-requirements
Content-Type: application/json

["cv", "passport", "kcse_certificate", "certificate_of_good_conduct"]
```

### 3. Get Job Document Requirements

```http
GET /api/jobs/{job_id}/document-requirements
```

Response:

```json
{
  "job_id": 123,
  "required_documents": ["cv", "passport", "kcse_certificate"]
}
```

### 4. Submit Job Application with Documents

```http
POST /api/applications/
Content-Type: application/json

{
  "job_id": 123,
  "applicant_name": "John Doe",
  "email": "john@example.com",
  "phone": "0700000000",
  "cover_letter": "Dear hiring manager...",
  "passport_number": "A1234567",
  "documents": [
    {
      "document_type": "cv",
      "document_url": "https://storage.example.com/cv.pdf",
      "document_name": "John_Doe_CV.pdf"
    },
    {
      "document_type": "passport",
      "document_url": "https://storage.example.com/passport.pdf",
      "document_name": "passport_copy.pdf"
    },
    {
      "document_type": "kcse_certificate",
      "document_url": "https://storage.example.com/kcse.pdf",
      "document_name": "KCSE_Certificate.pdf"
    }
  ]
}
```

## Migration Steps

1. **Run the migration to add new tables:**

```bash
source venv/bin/activate
python migrate_existing_cvs.py  # Migrate existing CV data
alembic upgrade add_flexible_documents
```

2. **Update existing jobs with document requirements:**

```bash
# Example: Update a job to require CV, passport, and KCSE certificate
curl -X PATCH "http://localhost:8000/api/jobs/1/document-requirements" \
  -H "Content-Type: application/json" \
  -d '["cv", "passport", "kcse_certificate"]'
```

## Frontend Integration Examples

### React/TypeScript Example

```typescript
// Types
interface DocumentType {
  value: string;
  label: string;
}

interface JobDocumentRequirements {
  job_id: number;
  required_documents: string[];
}

interface ApplicationDocument {
  document_type: string;
  document_url: string;
  document_name: string;
}

// Get document requirements for a job
const getJobDocumentRequirements = async (
  jobId: number
): Promise<JobDocumentRequirements> => {
  const response = await fetch(`/api/jobs/${jobId}/document-requirements`);
  return response.json();
};

// Submit application with documents
const submitApplication = async (applicationData: {
  job_id: number;
  applicant_name: string;
  email: string;
  phone: string;
  cover_letter?: string;
  passport_number?: string;
  documents: ApplicationDocument[];
}) => {
  const response = await fetch("/api/applications/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(applicationData),
  });
  return response.json();
};
```

## Benefits

1. **Flexibility**: Each job can have different document requirements
2. **Scalability**: Easy to add new document types
3. **User Experience**: Clear indication of what documents are needed
4. **Compliance**: Ensures all required documents are collected
5. **Organization**: Documents are properly categorized and stored

## Best Practices

1. **Default Requirements**: Always include "cv" as a default requirement
2. **Clear Labels**: Use descriptive names for document types
3. **Validation**: Validate file types and sizes on the frontend
4. **Security**: Ensure secure file upload and storage
5. **Accessibility**: Provide clear instructions for each document type
