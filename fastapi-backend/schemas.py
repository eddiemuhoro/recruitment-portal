from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from models import JobType, JobStatus, ApplicationStatus, UserRole, DocumentType

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class JobBase(BaseModel):
    title: str
    company: str
    location: str
    type: JobType
    description: str
    requirements: List[str]
    salary: str
    status: Optional[JobStatus] = JobStatus.ACTIVE
    passport_required: bool = False
    required_documents: Optional[List[DocumentType]] = None

class JobCreate(JobBase):
    employer_id: int

class Job(JobBase):
    id: int
    posted_date: datetime
    employer_id: Optional[int] = None

    class Config:
        from_attributes = True

# Document schemas
class ApplicationDocumentCreate(BaseModel):
    document_type: DocumentType
    document_url: str
    document_name: str

class ApplicationDocumentResponse(BaseModel):
    id: int
    document_type: DocumentType
    document_url: str
    document_name: str
    uploaded_at: datetime
    
    class Config:
        from_attributes = True

class JobApplicationBase(BaseModel):
    job_id: int
    applicant_name: str
    email: EmailStr
    phone: str
    cover_letter: Optional[str] = None
    passport_number: str | None = None
    status: ApplicationStatus = ApplicationStatus.PENDING
    applied_date: datetime = Field(default_factory=datetime.utcnow)

class JobApplicationCreate(BaseModel):
    job_id: int
    applicant_name: str
    email: EmailStr
    phone: str
    cover_letter: Optional[str] = None
    passport_number: str | None = None
    documents: List[ApplicationDocumentCreate]

class JobApplicationUpdate(BaseModel):
    status: str

class JobApplication(JobApplicationBase):
    id: int
    status: ApplicationStatus
    applied_date: datetime
    cover_letter: Optional[str] = None
    documents: Optional[List[ApplicationDocumentResponse]] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class EmployerInquiryBase(BaseModel):
    employer_name: str
    message: str
    contact_email: EmailStr
    phone_number: str | None = None
    is_urgent: bool = False
    agency_id: int

class EmployerInquiryCreate(EmployerInquiryBase):
    pass

class EmployerInquiry(EmployerInquiryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True