from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def make_cover_letter_nullable():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Check current state of cover_letter column
        try:
            result = connection.execute(text("""
                SELECT column_name, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'job_applications' 
                AND column_name = 'cover_letter'
            """))
            current_state = result.fetchone()
            print(f"Current cover_letter column state: {current_state}")
        except Exception as e:
            print(f"Error checking column state: {e}")

        # Make cover_letter column nullable
        try:
            connection.execute(text("""
                ALTER TABLE job_applications 
                ALTER COLUMN cover_letter DROP NOT NULL
            """))
            connection.commit()
            print("Successfully made cover_letter column nullable")
        except Exception as e:
            print(f"Error making cover_letter nullable: {e}")

if __name__ == "__main__":
    make_cover_letter_nullable()
