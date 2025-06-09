from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, UserRole
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def seed_users():
    db = SessionLocal()
    try:
        users = [
            User(id=1, name="Admin User", email="admin@example.com", role=UserRole.ADMIN, hashed_password=get_password_hash("admin123")),
            User(id=2, name="Employer User", email="employer@example.com", role=UserRole.EMPLOYER, hashed_password=get_password_hash("employer123")),
            User(id=3, name="Regular User", email="user@example.com", role=UserRole.USER, hashed_password=get_password_hash("user123")),
        ]
        for user in users:
            db.add(user)
        db.commit()
        print("Users seeded successfully.")
    except Exception as e:
        print(f"Error seeding users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_users() 