from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def add_required_documents_column():
    """Add required_documents column to jobs table and create application_documents table"""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        try:
            # Check if required_documents column exists
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'jobs' AND column_name = 'required_documents'
            """))
            column_exists = result.fetchone()
            
            if not column_exists:
                print("Adding required_documents column to jobs table...")
                connection.execute(text("""
                    ALTER TABLE jobs 
                    ADD COLUMN required_documents JSON
                """))
                print("✓ Added required_documents column")
            else:
                print("✓ required_documents column already exists")

            # Check if documenttype enum exists
            result = connection.execute(text("""
                SELECT 1 FROM pg_type WHERE typname = 'documenttype'
            """))
            enum_exists = result.fetchone()
            
            if not enum_exists:
                print("Creating documenttype enum...")
                connection.execute(text("""
                    CREATE TYPE documenttype AS ENUM (
                        'cv', 'passport', 'birth_certificate', 'kcse_certificate',
                        'kcpe_certificate', 'certificate_of_good_conduct', 'academic_transcripts',
                        'professional_certificate', 'work_permit', 'police_clearance',
                        'medical_certificate', 'other'
                    )
                """))
                print("✓ Created documenttype enum")
            else:
                print("✓ documenttype enum already exists")

            # Check if application_documents table exists
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'application_documents'
            """))
            table_exists = result.fetchone()
            
            if not table_exists:
                print("Creating application_documents table...")
                connection.execute(text("""
                    CREATE TABLE application_documents (
                        id SERIAL PRIMARY KEY,
                        application_id INTEGER NOT NULL REFERENCES job_applications(id),
                        document_type documenttype NOT NULL,
                        document_url VARCHAR NOT NULL,
                        document_name VARCHAR NOT NULL,
                        uploaded_at TIMESTAMP DEFAULT NOW()
                    )
                """))
                
                connection.execute(text("""
                    CREATE INDEX ix_application_documents_id ON application_documents (id)
                """))
                print("✓ Created application_documents table")
            else:
                print("✓ application_documents table already exists")

            connection.commit()
            print("✅ Database migration completed successfully!")
            
        except Exception as e:
            print(f"❌ Error during migration: {e}")
            connection.rollback()
            raise

if __name__ == "__main__":
    add_required_documents_column()
