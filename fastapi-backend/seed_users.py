from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole, Agency
from passlib.context import CryptContext
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_users():
    db = SessionLocal()
    try:
        agencies = db.query(Agency).all()
        if not agencies:
            print("No agencies found. Please seed agencies first.")
            return
        users = [
            User(name="Admin User", email="admin@example.com", role=UserRole.ADMIN, hashed_password=get_password_hash("admin123"), agency_id=agencies[0].id),
            User(name="Employer User", email="employer@example.com", role=UserRole.EMPLOYER, hashed_password=get_password_hash("employer123"), agency_id=random.choice(agencies).id),
            User(name="Regular User", email="user@example.com", role=UserRole.USER, hashed_password=get_password_hash("user123"), agency_id=random.choice(agencies).id),
        ]
        for user in users:
            db.add(user)
        db.commit()
        print("Users seeded successfully.")
    except Exception as e:
        print(f"Error seeding users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_users() 