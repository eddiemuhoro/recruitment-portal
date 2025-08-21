from sqlalchemy import Column, Integer, String, Text, ARRAY, DateTime, ForeignKey, Enum, Date, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class JobType(str, enum.Enum):
    FULL_TIME = "Full-time"
    PART_TIME = "Part-time"
    CONTRACT = "Contract"
    REMOTE = "Remote"

class JobStatus(str, enum.Enum):
    ACTIVE = "active"
    CLOSED = "closed"
    DRAFT = "draft"

class ApplicationStatus(str, enum.Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    ACCEPTED = "accepted"
    REJECTED = "rejected"

class InquiryStatus(str, enum.Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"
    CLOSED = "closed"

class Priority(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EMPLOYER = "employer"
    USER = "user"

class DocumentType(str, enum.Enum):
    CV = "cv"
    PASSPORT = "passport"
    BIRTH_CERTIFICATE = "birth_certificate"
    KCSE_CERTIFICATE = "kcse_certificate"
    KCPE_CERTIFICATE = "kcpe_certificate"
    CERTIFICATE_OF_GOOD_CONDUCT = "certificate_of_good_conduct"
    ACADEMIC_TRANSCRIPTS = "academic_transcripts"
    PROFESSIONAL_CERTIFICATE = "professional_certificate"
    WORK_PERMIT = "work_permit"
    POLICE_CLEARANCE = "police_clearance"
    MEDICAL_CERTIFICATE = "medical_certificate"
    OTHER = "other"

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(Integer, primary_key=True, index=True)
    agency_name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=False)
    license_number = Column(String, nullable=False)
    license_expiry = Column(Date, nullable=False)
    website_url = Column(String)

    users = relationship("User", back_populates="agency")
    inquiries = relationship("EmployerInquiry", back_populates="agency")

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    hashed_password = Column(String, nullable=False)
    agency_id = Column(Integer, ForeignKey("agencies.id"))

    agency = relationship("Agency", back_populates="users")
    jobs = relationship("Job", back_populates="employer")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    company = Column(String, nullable=False)
    location = Column(String, nullable=False)
    type = Column(Enum(JobType), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(ARRAY(String), nullable=False)
    salary = Column(String, nullable=False)
    posted_date = Column(DateTime, default=datetime.utcnow)
    status = Column(Enum(JobStatus), default=JobStatus.ACTIVE)
    employer_id = Column(Integer, ForeignKey("users.id"))
    passport_required = Column(Boolean, default=False)
    required_documents = Column(JSON, nullable=True)  # Store array of required document types

    employer = relationship("User", back_populates="jobs")
    applications = relationship("JobApplication", back_populates="job")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    applicant_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    cover_letter = Column(Text, nullable=True)
    passport_number = Column(String, nullable=True)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    applied_date = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications")
    documents = relationship("ApplicationDocument", back_populates="application")

class ApplicationDocument(Base):
    __tablename__ = "application_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    document_url = Column(String, nullable=False)
    document_name = Column(String, nullable=False)  # Original filename
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    application = relationship("JobApplication", back_populates="documents")

class EmployerInquiry(Base):
    __tablename__ = "employer_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    agency_id = Column(Integer, ForeignKey("agencies.id"), nullable=False)
    employer_name = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    contact_email = Column(String, nullable=False)
    phone_number = Column(String, nullable=True)
    is_urgent = Column(Boolean, default=False)
    status = Column(Enum(InquiryStatus), default=InquiryStatus.NEW)
    priority = Column(Enum(Priority), default=Priority.MEDIUM)
    admin_notes = Column(Text, nullable=True)
    admin_response = Column(Text, nullable=True)
    assigned_to = Column(String, nullable=True)  # Admin username/email
    responded_at = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    agency = relationship("Agency", back_populates="inquiries")

class ContactInquiry(Base):
    __tablename__ = "contact_inquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)  # Phone number for WhatsApp/SMS
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    response = Column(Text, nullable=True)  # Admin can add response
    responded_at = Column(DateTime, nullable=True)