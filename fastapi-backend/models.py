from sqlalchemy import Column, Integer, String, Text, ARRAY, DateTime, ForeignKey, Enum, Date
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

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    EMPLOYER = "employer"
    USER = "user"

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

    employer = relationship("User", back_populates="jobs")
    applications = relationship("JobApplication", back_populates="job")

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id"))
    applicant_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    cv_url = Column(String, nullable=False)
    cover_letter = Column(Text, nullable=False)
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.PENDING)
    applied_date = Column(DateTime, default=datetime.utcnow)

    job = relationship("Job", back_populates="applications") 