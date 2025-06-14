from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, Agency
import random

def update_users_agencies():
    db = SessionLocal()
    try:
        agencies = db.query(Agency).all()
        if not agencies:
            print("No agencies found. Please seed agencies first.")
            return
        users = db.query(User).all()
        for user in users:
            user.agency_id = random.choice(agencies).id
        db.commit()
        print("Users updated with agency assignments successfully.")
    except Exception as e:
        print(f"Error updating users: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_users_agencies() 