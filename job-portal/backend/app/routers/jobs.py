from fastapi import APIRouter, HTTPException, Depends
from typing import List
from ..models.job import Job, JobCreate
from ..database import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/", response_model=List[Job])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()

@router.post("/", response_model=Job)
def create_job(job: JobCreate, db: Session = Depends(get_db)):
    db_job = Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job

@router.delete("/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"} 