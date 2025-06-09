from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import JobApplication
from schemas import JobApplicationCreate, JobApplication as JobApplicationSchema

router = APIRouter()

@router.post("/applications/", response_model=JobApplicationSchema)
def create_application(application: JobApplicationCreate, db: Session = Depends(get_db)):
    db_application = JobApplication(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

@router.get("/applications/", response_model=List[JobApplicationSchema])
def read_applications(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    applications = db.query(JobApplication).offset(skip).limit(limit).all()
    return applications

@router.get("/applications/{application_id}", response_model=JobApplicationSchema)
def read_application(application_id: int, db: Session = Depends(get_db)):
    db_application = db.query(JobApplication).filter(JobApplication.id == application_id).first()
    if db_application is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return db_application 