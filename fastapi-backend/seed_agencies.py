from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Agency
from datetime import date, timedelta

# Sample agencies data
sample_agencies = [
    {
        "agency_name": "Tech Recruiters Pro",
        "email": "contact@techrecruiterspro.com",
        "phone": "+1-555-0123",
        "license_number": "TRP-2024-001",
        "license_expiry": date.today() + timedelta(days=365),
        "website_url": "https://techrecruiterspro.com"
    },
    {
        "agency_name": "Global Talent Solutions",
        "email": "info@globaltalentsolutions.com",
        "phone": "+1-555-0124",
        "license_number": "GTS-2024-002",
        "license_expiry": date.today() + timedelta(days=365),
        "website_url": "https://globaltalentsolutions.com"
    },
    {
        "agency_name": "Creative Staffing Agency",
        "email": "hello@creativestaffing.com",
        "phone": "+1-555-0125",
        "license_number": "CSA-2024-003",
        "license_expiry": date.today() + timedelta(days=365),
        "website_url": "https://creativestaffing.com"
    }
]

def seed_agencies():
    db = SessionLocal()
    try:
        # Check if agencies already exist
        existing_agencies = db.query(Agency).first()
        if existing_agencies:
            print("Agencies already seeded!")
            return

        # Create new agencies
        for agency_data in sample_agencies:
            agency = Agency(**agency_data)
            db.add(agency)
        
        db.commit()
        print("Successfully seeded agencies!")
    except Exception as e:
        print(f"An error occurred: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_agencies() 