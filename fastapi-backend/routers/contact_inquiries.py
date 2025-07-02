from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models
import schemas
from datetime import datetime
from phone_utils import normalize_kenyan_phone

router = APIRouter(
    prefix="/contact-inquiries",
    tags=["contact-inquiries"]
)

@router.post("/", response_model=schemas.ContactInquiry, status_code=status.HTTP_201_CREATED)
def create_contact_inquiry(
    inquiry: schemas.ContactInquiryCreate,
    db: Session = Depends(get_db)
):
    """Create a new contact inquiry from the contact form."""
    # Normalize phone number if provided
    normalized_phone = None
    if inquiry.phone:
        normalized_phone = normalize_kenyan_phone(inquiry.phone)
        if not normalized_phone:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid phone number format. Please use Kenyan format (e.g., 0705982249 or +254705982249)"
            )
    
    # Create new inquiry
    db_inquiry = models.ContactInquiry(
        name=inquiry.name,
        email=inquiry.email,
        phone=normalized_phone,
        subject=inquiry.subject,
        message=inquiry.message,
        created_at=datetime.utcnow(),
        is_read=False
    )
    
    db.add(db_inquiry)
    db.commit()
    db.refresh(db_inquiry)
    
    return db_inquiry

@router.get("/", response_model=List[schemas.ContactInquiry])
def get_contact_inquiries(
    skip: int = 0,
    limit: int = 100,
    is_read: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get all contact inquiries with optional filtering by read status."""
    query = db.query(models.ContactInquiry)
    
    if is_read is not None:
        query = query.filter(models.ContactInquiry.is_read == is_read)
    
    inquiries = query.order_by(models.ContactInquiry.created_at.desc()).offset(skip).limit(limit).all()
    return inquiries

@router.get("/{inquiry_id}", response_model=schemas.ContactInquiry)
def get_contact_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific contact inquiry by ID."""
    inquiry = db.query(models.ContactInquiry).filter(models.ContactInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact inquiry not found"
        )
    return inquiry

@router.put("/{inquiry_id}", response_model=schemas.ContactInquiry)
def update_contact_inquiry(
    inquiry_id: int,
    inquiry_update: schemas.ContactInquiryUpdate,
    db: Session = Depends(get_db)
):
    """Update a contact inquiry (for admin use - mark as read, add response)."""
    inquiry = db.query(models.ContactInquiry).filter(models.ContactInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact inquiry not found"
        )
    
    # Update fields
    if inquiry_update.is_read is not None:
        inquiry.is_read = inquiry_update.is_read
    
    if inquiry_update.response is not None:
        inquiry.response = inquiry_update.response
        inquiry.responded_at = datetime.utcnow()
    
    db.commit()
    db.refresh(inquiry)
    
    return inquiry

@router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_inquiry(
    inquiry_id: int,
    db: Session = Depends(get_db)
):
    """Delete a contact inquiry."""
    inquiry = db.query(models.ContactInquiry).filter(models.ContactInquiry.id == inquiry_id).first()
    if inquiry is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact inquiry not found"
        )
    
    db.delete(inquiry)
    db.commit()
    
    return None
