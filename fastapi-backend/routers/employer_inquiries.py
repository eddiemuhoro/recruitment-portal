from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List, Optional
from database import get_db
import models
import schemas
from datetime import datetime

router = APIRouter(
    prefix="/employer-inquiries",
    tags=["employer-inquiries"]
)

@router.post("/", response_model=schemas.EmployerInquiry, status_code=status.HTTP_201_CREATED)
def create_employer_inquiry(
    inquiry: schemas.EmployerInquiryCreate,
    db: Session = Depends(get_db)
):
    # Verify agency exists
    agency = db.query(models.Agency).filter(models.Agency.id == inquiry.agency_id).first()
    if not agency:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Agency not found"
        )

    # Create new inquiry
    db_inquiry = models.EmployerInquiry(
        agency_id=inquiry.agency_id,
        employer_name=inquiry.employer_name,
        message=inquiry.message,
        contact_email=inquiry.contact_email,
        created_at=datetime.utcnow()
    )
    
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    
    return db_inquiry

@router.get("/", response_model=List[schemas.EmployerInquiry])
def get_employer_inquiries(
    skip: int = 0,
    limit: int = 100,
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    search: Optional[str] = Query(None, description="Search in employer name, email, or message"),
    assigned_to: Optional[str] = Query(None, description="Filter by assigned admin"),
    db: Session = Depends(get_db)
):
    query = db.query(models.EmployerInquiry)
    
    # Apply filters
    if status:
        query = query.filter(models.EmployerInquiry.status == status)
    if priority:
        query = query.filter(models.EmployerInquiry.priority == priority)
    if assigned_to:
        query = query.filter(models.EmployerInquiry.assigned_to == assigned_to)
    if search:
        search_filter = or_(
            models.EmployerInquiry.employer_name.ilike(f"%{search}%"),
            models.EmployerInquiry.contact_email.ilike(f"%{search}%"),
            models.EmployerInquiry.message.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    # Order by priority and created date
    query = query.order_by(
        models.EmployerInquiry.priority.desc(),
        models.EmployerInquiry.created_at.desc()
    )
    
    inquiries = query.offset(skip).limit(limit).all()
    return inquiries

@router.get("/{inquiry_id}", response_model=schemas.EmployerInquiry)
def get_employer_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    inquiry = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    return inquiry

@router.put("/{inquiry_id}", response_model=schemas.EmployerInquiry)
def update_employer_inquiry(
    inquiry_id: int,
    inquiry_update: schemas.EmployerInquiryUpdate,
    db: Session = Depends(get_db)
):
    inquiry = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    
    # Update fields
    update_data = inquiry_update.dict(exclude_unset=True)
    
    # Set timestamps based on status changes
    if "status" in update_data:
        if update_data["status"] == "resolved" and inquiry.status != "resolved":
            update_data["resolved_at"] = datetime.utcnow()
        if "admin_response" in update_data and update_data["admin_response"]:
            update_data["responded_at"] = datetime.utcnow()
    
    update_data["updated_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(inquiry, field, value)
    
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.delete("/{inquiry_id}")
def delete_employer_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    inquiry = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    
    db.delete(inquiry)
    db.commit()
    return {"message": "Inquiry deleted successfully"}

@router.post("/bulk-update")
def bulk_update_inquiries(
    inquiry_ids: List[int],
    update_data: schemas.EmployerInquiryUpdate,
    db: Session = Depends(get_db)
):
    inquiries = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.id.in_(inquiry_ids)).all()
    
    if not inquiries:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No inquiries found"
        )
    
    update_dict = update_data.dict(exclude_unset=True)
    update_dict["updated_at"] = datetime.utcnow()
    
    # Apply bulk update
    db.query(models.EmployerInquiry).filter(models.EmployerInquiry.id.in_(inquiry_ids)).update(
        update_dict, synchronize_session=False
    )
    
    db.commit()
    return {"message": f"Updated {len(inquiries)} inquiries", "updated_count": len(inquiries)}

@router.get("/stats/summary")
def get_inquiry_stats(db: Session = Depends(get_db)):
    """Get summary statistics for inquiries"""
    total = db.query(models.EmployerInquiry).count()
    new = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.status == "new").count()
    in_progress = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.status == "in_progress").count()
    resolved = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.status == "resolved").count()
    urgent = db.query(models.EmployerInquiry).filter(models.EmployerInquiry.priority == "urgent").count()
    
    return {
        "total": total,
        "new": new,
        "in_progress": in_progress,
        "resolved": resolved,
        "urgent": urgent
    } 