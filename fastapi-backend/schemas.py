from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
from models import JobType, JobStatus, ApplicationStatus, UserRole

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

class JobCreate(JobBase):
    employer_id: int

class Job(JobBase):
    id: int
    posted_date: datetime
    employer_id: Optional[int] = None

    class Config:
        from_attributes = True

class JobApplicationBase(BaseModel):
    job_id: int
    applicant_name: str
    email: EmailStr
    phone: str
    cover_letter: str
    cv_url: str
    status: ApplicationStatus = ApplicationStatus.PENDING
    applied_date: datetime = Field(default_factory=datetime.utcnow)

class JobApplicationCreate(JobApplicationBase):
    pass

class JobApplication(JobApplicationBase):
    id: int
    cv_url: str
    status: ApplicationStatus
    applied_date: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None 