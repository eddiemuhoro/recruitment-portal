from sqlalchemy.orm import Session
from database import SessionLocal
from models import EmployerInquiry
from datetime import datetime, timedelta, UTC

# Sample inquiries data
sample_inquiries = [
    {
        "agency_id": 1,
        "employer_name": "Dubai Hospitality Group",
        "message": "Looking to hire 50 housekeeping staff for our new hotel opening in Dubai Marina. Need experienced workers with at least 2 years in 5-star hotels. Immediate start required.",
        "contact_email": "hr@dubaigroup.com",
        "phone_number": "+971501234567",
        "is_urgent": True,
        "created_at": datetime.now(UTC) - timedelta(days=2)
    },
    {
        "agency_id": 1,
        "employer_name": "Qatar Construction Co.",
        "message": "Need 100 construction workers for a major infrastructure project in Doha. Skills required: masonry, electrical, plumbing. Project duration: 2 years.",
        "contact_email": "recruitment@qatarconstruction.qa",
        "phone_number": "+97455123456",
        "is_urgent": False,
        "created_at": datetime.now(UTC) - timedelta(days=5)
    },
    {
        "agency_id": 1,
        "employer_name": "Saudi Healthcare Services",
        "message": "Seeking 30 healthcare aides for our hospital network in Riyadh. Must have basic medical training and English proficiency. Competitive salary package.",
        "contact_email": "careers@saudihs.com",
        "phone_number": "+966501234567",
        "is_urgent": True,
        "created_at": datetime.now(UTC) - timedelta(days=1)
    },
    {
        "agency_id": 1,
        "employer_name": "UAE Security Solutions",
        "message": "Urgent requirement for 20 security personnel. Must have previous security experience and valid certifications. Immediate deployment needed.",
        "contact_email": "security@uaesolutions.ae",
        "phone_number": "+971502345678",
        "is_urgent": True,
        "created_at": datetime.now(UTC) - timedelta(days=3)
    },
    {
        "agency_id": 1,
        "employer_name": "Oman Restaurant Chain",
        "message": "Looking for 15 experienced chefs and kitchen staff for our new restaurant chain in Muscat. Special focus on international cuisine expertise.",
        "contact_email": "hr@omanrestaurants.com",
        "created_at": datetime.now(UTC) - timedelta(days=4)
    }
]

def seed_inquiries():
    db = SessionLocal()
    try:
        # Delete existing inquiries
        print("Deleting existing inquiries...")
        db.query(EmployerInquiry).delete()
        db.commit()

        # Add new inquiries
        print("Adding new inquiries...")
        for inquiry_data in sample_inquiries:
            inquiry = EmployerInquiry(**inquiry_data)
            db.add(inquiry)
        db.commit()

        # Verify the count
        count = db.query(EmployerInquiry).count()
        print(f"Successfully seeded {count} inquiries")

    except Exception as e:
        print(f"Error seeding inquiries: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_inquiries() 