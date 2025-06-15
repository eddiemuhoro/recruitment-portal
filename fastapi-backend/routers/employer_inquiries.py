from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
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
    db: Session = Depends(get_db)
):
    inquiries = db.query(models.EmployerInquiry).offset(skip).limit(limit).all()
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