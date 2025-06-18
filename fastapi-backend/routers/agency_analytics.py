from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from typing import List, Dict
from datetime import datetime, timedelta
from database import get_db
import models
import schemas

router = APIRouter(
    prefix="/agency-analytics",
    tags=["agency-analytics"]
)

@router.get("/{agency_id}/dashboard", response_model=Dict)
def get_agency_dashboard(
    agency_id: int,
    db: Session = Depends(get_db)
):
    # Verify agency exists
    agency = db.query(models.Agency).filter(models.Agency.id == agency_id).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # Get current date and date 30 days ago
    current_date = datetime.utcnow()
    thirty_days_ago = current_date - timedelta(days=30)

    # Get total active jobs
    active_jobs = db.query(models.Job).join(
        models.User, models.Job.employer_id == models.User.id
    ).filter(
        models.User.agency_id == agency_id,
        models.Job.status == models.JobStatus.ACTIVE
    ).count()

    # Get total applications in last 30 days
    recent_applications = db.query(models.JobApplication).join(
        models.Job, models.JobApplication.job_id == models.Job.id
    ).join(
        models.User, models.Job.employer_id == models.User.id
    ).filter(
        models.User.agency_id == agency_id,
        models.JobApplication.applied_date >= thirty_days_ago
    ).count()

    # Get total inquiries in last 30 days
    recent_inquiries = db.query(models.EmployerInquiry).filter(
        models.EmployerInquiry.agency_id == agency_id,
        models.EmployerInquiry.created_at >= thirty_days_ago
    ).count()

    # Get urgent inquiries
    urgent_inquiries = db.query(models.EmployerInquiry).filter(
        models.EmployerInquiry.agency_id == agency_id,
        models.EmployerInquiry.is_urgent == True
    ).count()

    # Get job posting trends (last 30 days)
    job_trends = db.query(
        func.date(models.Job.posted_date).label('date'),
        func.count(models.Job.id).label('count')
    ).join(
        models.User, models.Job.employer_id == models.User.id
    ).filter(
        models.User.agency_id == agency_id,
        models.Job.posted_date >= thirty_days_ago
    ).group_by(
        func.date(models.Job.posted_date)
    ).all()

    # Get application status distribution
    application_status = db.query(
        models.JobApplication.status,
        func.count(models.JobApplication.id).label('count')
    ).join(
        models.Job, models.JobApplication.job_id == models.Job.id
    ).join(
        models.User, models.Job.employer_id == models.User.id
    ).filter(
        models.User.agency_id == agency_id
    ).group_by(
        models.JobApplication.status
    ).all()

    return {
        "active_jobs": active_jobs,
        "recent_applications": recent_applications,
        "recent_inquiries": recent_inquiries,
        "urgent_inquiries": urgent_inquiries,
        "job_trends": [{"date": str(trend.date), "count": trend.count} for trend in job_trends],
        "application_status": [{"status": status.status, "count": status.count} for status in application_status]
    }

@router.get("/{agency_id}/revenue", response_model=Dict)
def get_agency_revenue(
    agency_id: int,
    db: Session = Depends(get_db)
):
    # This is a placeholder for revenue tracking
    # You'll need to implement actual revenue tracking logic based on your business model
    return {
        "total_revenue": 0,
        "monthly_revenue": 0,
        "revenue_trend": []
    } 