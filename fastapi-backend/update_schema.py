from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def update_schema():
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # First, ensure passport_number exists
        try:
            connection.execute(text("""
                ALTER TABLE job_applications 
                ADD COLUMN IF NOT EXISTS passport_number VARCHAR
            """))
            print("Added passport_number column if it didn't exist")
        except Exception as e:
            print(f"Error adding passport_number: {e}")

        # Then remove has_passport if it exists
        try:
            connection.execute(text("""
                ALTER TABLE job_applications 
                DROP COLUMN IF EXISTS has_passport
            """))
            print("Removed has_passport column if it existed")
        except Exception as e:
            print(f"Error removing has_passport: {e}")

        connection.commit()
        print("Successfully updated schema")

if __name__ == "__main__":
    update_schema() 