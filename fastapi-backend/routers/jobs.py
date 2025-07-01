from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Job
from schemas import JobCreate, Job as JobSchema
from redis_config import get_cache, RedisCache
import json

router = APIRouter()

@router.post("/jobs/", response_model=JobSchema)
def create_job(job: JobCreate, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    # Convert the Pydantic model to a dict and create the database model
    job_data = job.dict()
    db_job = Job(**job_data)
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    # Clear jobs cache when new job is created
    cache.delete("jobs:all")
    cache.delete(f"jobs:search:*")  # Clear search caches
    
    return db_job

@router.get("/jobs/", response_model=List[JobSchema])
def read_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    # Create cache key
    cache_key = f"jobs:all:{skip}:{limit}"
    
    # Try to get from cache first
    cached_jobs = cache.get(cache_key)
    if cached_jobs:
        return cached_jobs
    
    # If not in cache, query database
    jobs = db.query(Job).offset(skip).limit(limit).all()
    
    # Convert to dict for caching
    jobs_data = [job.__dict__ for job in jobs]
    for job_data in jobs_data:
        job_data.pop('_sa_instance_state', None)  # Remove SQLAlchemy state
    
    # Cache for 5 minutes
    cache.set(cache_key, jobs_data, expire=300)
    
    return jobs

@router.get("/jobs/{job_id}", response_model=JobSchema)
def read_job(job_id: int, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    # Try cache first
    cache_key = f"job:{job_id}"
    cached_job = cache.get(cache_key)
    if cached_job:
        return cached_job
    
    # Query database
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Cache the job for 10 minutes
    job_data = db_job.__dict__.copy()
    job_data.pop('_sa_instance_state', None)
    cache.set(cache_key, job_data, expire=600)
    
    return db_job

@router.put("/jobs/{job_id}", response_model=JobSchema)
def update_job(job_id: int, job: JobCreate, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job_data = job.dict()
    for key, value in job_data.items():
        setattr(db_job, key, value)
    
    db.commit()
    db.refresh(db_job)
    
    # Clear caches
    cache.delete(f"job:{job_id}")
    cache.delete("jobs:all")
    
    return db_job

@router.delete("/jobs/{job_id}")
def delete_job(job_id: int, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db.delete(db_job)
    db.commit()
    
    # Clear caches
    cache.delete(f"job:{job_id}")
    cache.delete("jobs:all")
    
    return {"message": "Job deleted successfully"}

# New endpoint for job search with caching
@router.get("/jobs/search/{query}", response_model=List[JobSchema])
def search_jobs(query: str, db: Session = Depends(get_db), cache: RedisCache = Depends(get_cache)):
    cache_key = f"jobs:search:{query.lower()}"
    
    # Try cache first
    cached_results = cache.get(cache_key)
    if cached_results:
        return cached_results
    
    # Search database
    jobs = db.query(Job).filter(
        Job.title.ilike(f"%{query}%") | 
        Job.description.ilike(f"%{query}%") |
        Job.location.ilike(f"%{query}%")
    ).limit(50).all()
    
    # Prepare for caching
    jobs_data = []
    for job in jobs:
        job_data = job.__dict__.copy()
        job_data.pop('_sa_instance_state', None)
        jobs_data.append(job_data)
    
    # Cache search results for 15 minutes
    cache.set(cache_key, jobs_data, expire=900)
    
    return jobs

# Background task integration
@router.post("/jobs/{job_id}/send-notification")
def send_job_notification(
    job_id: int, 
    recipient_email: str,
    db: Session = Depends(get_db)
):
    """Send job notification email using background task"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Import background task
    from background_tasks import send_email_notification
    
    # Create email content
    subject = f"New Job Opportunity: {job.title}"
    message = f"""
    Dear Candidate,
    
    We have a new job opportunity that might interest you:
    
    Title: {job.title}
    Location: {job.location}
    Company: {job.company}
    
    Description: {job.description}
    
    Best regards,
    Skyways Global Recruitment Team
    """
    
    # Send task to background queue
    task = send_email_notification.delay(recipient_email, subject, message)
    
    return {
        "message": "Notification queued successfully",
        "task_id": task.id,
        "job_id": job_id
    }

@router.get("/jobs/analytics/popular")
def get_popular_jobs(cache: RedisCache = Depends(get_cache), db: Session = Depends(get_db)):
    """Get popular jobs based on view counts stored in Redis"""
    cache_key = "analytics:popular_jobs"
    
    # Try cache first
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    # Get job view counts from Redis
    from redis_config import get_redis
    redis_client = get_redis()
    
    job_views = {}
    view_keys = redis_client.keys("job_views:*")
    
    for key in view_keys:
        job_id = key.split(":")[-1]
        views = redis_client.get(key) or 0
        job_views[int(job_id)] = int(views)
    
    # Sort by views and get top 10
    popular_job_ids = sorted(job_views.items(), key=lambda x: x[1], reverse=True)[:10]
    
    # Get job details
    popular_jobs = []
    for job_id, views in popular_job_ids:
        job = db.query(Job).filter(Job.id == job_id).first()
        if job:
            job_data = {
                "id": job.id,
                "title": job.title,
                "company": job.company,
                "location": job.location,
                "views": views
            }
            popular_jobs.append(job_data)
    
    # Cache for 1 hour
    cache.set(cache_key, popular_jobs, expire=3600)
    
    return {"popular_jobs": popular_jobs}

@router.post("/jobs/{job_id}/view")
def track_job_view(job_id: int, db: Session = Depends(get_db)):
    """Track job views for analytics"""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Increment view count in Redis
    from redis_config import get_redis
    redis_client = get_redis()
    
    view_key = f"job_views:{job_id}"
    redis_client.incr(view_key)
    redis_client.expire(view_key, 86400 * 30)  # Keep for 30 days
    
    current_views = redis_client.get(view_key) or 0
    
    return {
        "job_id": job_id,
        "views": int(current_views),
        "message": "View tracked successfully"
    }

@router.patch("/jobs/{job_id}/document-requirements")
def update_job_document_requirements(
    job_id: int, 
    required_documents: List[str], 
    db: Session = Depends(get_db), 
    cache: RedisCache = Depends(get_cache)
):
    """Update the required documents for a specific job"""
    from models import DocumentType
    
    # Validate document types
    valid_doc_types = [doc_type.value for doc_type in DocumentType]
    for doc_type in required_documents:
        if doc_type not in valid_doc_types:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid document type: {doc_type}. Valid types: {', '.join(valid_doc_types)}"
            )
    
    # Update job
    db_job = db.query(Job).filter(Job.id == job_id).first()
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    
    db_job.required_documents = required_documents
    db.commit()
    db.refresh(db_job)
    
    # Clear caches
    cache.delete(f"job:{job_id}")
    cache.delete("jobs:all")
    
    return {"job_id": job_id, "required_documents": required_documents}