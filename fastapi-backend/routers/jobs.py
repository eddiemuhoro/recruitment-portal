from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Job
from schemas import JobCreate, Job as JobSchema

router = APIRouter()

@router.post("/jobs/", response_model=JobSchema)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    # Convert the Pydantic model to a dict and create the database model
    job_data = job.dict()
    db_job = Job(**job_data)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.get("/jobs/", response_model=List[JobSchema])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    jobs = db.query(Job).offset(skip).limit(limit).all()
    return jobs

@router.get("/jobs/{job_id}", response_model=JobSchema)
def read_job(job_id: int, db: Session = Depends(get_db)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job 