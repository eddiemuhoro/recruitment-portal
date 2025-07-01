from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, selectinload
from typing import List
from database import get_db
from models import JobApplication, ApplicationDocument
from schemas import JobApplicationCreate, JobApplication as JobApplicationSchema, JobApplicationUpdate
from pydantic import BaseModel

class StatusUpdate(BaseModel):
    status: str

router = APIRouter()

@router.post("/applications/", response_model=JobApplicationSchema)
def create_application(application: JobApplicationCreate, db: Session = Depends(get_db)):
    # Create the job application (excluding documents from the dict)
    application_data = application.dict(exclude={'documents'})
    db_application = JobApplication(**application_data)
    db.add(db_application)
    db.flush()  # Flush to get the ID without committing
    
    # Create application documents
    for doc in application.documents:
        db_document = ApplicationDocument(
            application_id=db_application.id,
            document_type=doc.document_type,
            document_url=doc.document_url,
            document_name=doc.document_name
        )
        db.add(db_document)
    
    db.commit()
    db.refresh(db_application)
    return db_application

@router.get("/applications/", response_model=List[JobApplicationSchema])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(JobApplication).options(selectinload(JobApplication.documents)).offset(skip).limit(limit).all()
    return applications

@router.get("/applications/{application_id}", response_model=JobApplicationSchema)
def read_application(application_id: int, db: Session = Depends(get_db)):
    db_application = db.query(JobApplication).options(selectinload(JobApplication.documents)).filter(JobApplication.id == application_id).first()
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application

@router.patch("/applications/{application_id}/status", response_model=JobApplicationSchema)
def update_application_status(application_id: int, status_update: JobApplicationUpdate, db: Session = Depends(get_db)):
    db_application = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Validate status
    valid_statuses = ['pending', 'reviewed', 'accepted', 'rejected']
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}")
    
    # Update status
    db_application.status = status_update.status
    db.commit()
    db.refresh(db_application)
    return db_application

@router.get("/jobs/{job_id}/document-requirements")
def get_job_document_requirements(job_id: int, db: Session = Depends(get_db)):
    """Get the required documents for a specific job"""
    from models import Job
    job = db.query(Job).filter(Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Return the required documents or default to just CV
    required_docs = job.required_documents if job.required_documents else ["cv"]
    return {"job_id": job_id, "required_documents": required_docs}

@router.get("/document-types")
def get_available_document_types():
    """Get all available document types that can be uploaded"""
    from models import DocumentType
    return {
        "document_types": [
            {"value": doc_type.value, "label": doc_type.value.replace("_", " ").title()}
            for doc_type in DocumentType
        ]
    }