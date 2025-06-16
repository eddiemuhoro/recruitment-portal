from sqlalchemy.orm import Session
from database import SessionLocal
from models import Job, JobType, JobStatus
from datetime import datetime, timedelta, UTC

# Sample jobs data
sample_jobs = [
    {
        "title": "Security Guard - Dubai Mall",
        "company": "Dubai Security Services",
        "location": "Dubai, UAE",
        "type": JobType.FULL_TIME,
        "description": "We are seeking experienced security guards for Dubai Mall. Responsibilities include monitoring CCTV, patrolling assigned areas, and ensuring the safety of visitors and staff. Must be physically fit and able to work in shifts.",
        "requirements": [
            "Minimum 2 years security experience",
            "Valid SIRA certification",
            "Good communication skills in English",
            "Height minimum 175cm",
            "Clean criminal record"
        ],
        "salary": "AED 3,500 - 4,500 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=2),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Live-in Housekeeper",
        "company": "Luxury Villa Management",
        "location": "Abu Dhabi, UAE",
        "type": JobType.FULL_TIME,
        "description": "Looking for an experienced housekeeper for a luxury villa in Abu Dhabi. Must be detail-oriented and capable of maintaining high standards of cleanliness. Accommodation and meals provided.",
        "requirements": [
            "Minimum 3 years experience in luxury homes",
            "Knowledge of cleaning products and techniques",
            "Ability to work independently",
            "Good references from previous employers",
            "Flexible schedule"
        ],
        "salary": "AED 2,800 - 3,500 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=1),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Professional Driver - Family",
        "company": "Private Family Office",
        "location": "Doha, Qatar",
        "type": JobType.FULL_TIME,
        "description": "Seeking a reliable and experienced driver for a family of four. Must be familiar with Qatar roads and have excellent driving record. Duties include school runs, shopping, and family transportation.",
        "requirements": [
            "Valid Qatar driving license",
            "Minimum 5 years driving experience",
            "Clean driving record",
            "Knowledge of Qatar roads",
            "Good communication skills"
        ],
        "salary": "QAR 4,000 - 5,000 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=3),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Construction Foreman",
        "company": "Gulf Construction Co.",
        "location": "Riyadh, Saudi Arabia",
        "type": JobType.FULL_TIME,
        "description": "Leading construction company seeking experienced foreman for major infrastructure project. Must be able to manage teams, read blueprints, and ensure safety standards are met.",
        "requirements": [
            "10+ years construction experience",
            "Leadership experience",
            "OSHA certification",
            "Blueprint reading skills",
            "Bilingual (English/Arabic preferred)"
        ],
        "salary": "SAR 8,000 - 10,000 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=4),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Senior Caretaker",
        "company": "Property Management Group",
        "location": "Muscat, Oman",
        "type": JobType.FULL_TIME,
        "description": "Looking for a senior caretaker to manage multiple residential properties. Must have experience in property maintenance, basic repairs, and tenant relations.",
        "requirements": [
            "5+ years property management experience",
            "Basic maintenance skills",
            "Good organizational skills",
            "Valid Oman driving license",
            "Strong communication skills"
        ],
        "salary": "OMR 600 - 800 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=5),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Security Supervisor",
        "company": "Kuwait Security Solutions",
        "location": "Kuwait City, Kuwait",
        "type": JobType.FULL_TIME,
        "description": "Experienced security supervisor needed for commercial complex. Must be able to manage team of 10+ guards, handle emergency situations, and maintain security protocols.",
        "requirements": [
            "5+ years security experience",
            "2+ years supervisory role",
            "Valid security certifications",
            "Emergency response training",
            "Strong leadership skills"
        ],
        "salary": "KWD 500 - 700 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=6),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    },
    {
        "title": "Household Staff Manager",
        "company": "Royal Family Office",
        "location": "Dubai, UAE",
        "type": JobType.FULL_TIME,
        "description": "Seeking experienced household staff manager for large family residence. Must be able to coordinate multiple staff members, manage inventory, and maintain high standards of service.",
        "requirements": [
            "8+ years household management experience",
            "Staff supervision experience",
            "Inventory management skills",
            "Excellent organizational abilities",
            "Discretion and professionalism"
        ],
        "salary": "AED 8,000 - 10,000 per month",
        "posted_date": datetime.now(UTC) - timedelta(days=7),
        "status": JobStatus.ACTIVE,
        "employer_id": 1
    }
]

def seed_jobs():
    db = SessionLocal()
    try:
        # Get the highest existing job ID
        highest_id = db.query(Job).order_by(Job.id.desc()).first()
        start_id = highest_id.id if highest_id else 0
        
        # Add new jobs
        print("Adding new jobs...")
        for job_data in sample_jobs:
            # Skip if job with same title and company already exists
            existing_job = db.query(Job).filter(
                Job.title == job_data["title"],
                Job.company == job_data["company"]
            ).first()
            
            if not existing_job:
                job = Job(**job_data)
                db.add(job)
        
        db.commit()

        # Verify the count of new jobs
        new_count = db.query(Job).count() - start_id
        print(f"Successfully added {new_count} new jobs")

    except Exception as e:
        print(f"Error seeding jobs: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_jobs() 