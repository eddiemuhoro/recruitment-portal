from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate_to_flexible_documents():
    """Complete migration to flexible document system"""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        try:
            print("Starting migration to flexible document system...")
            
            # 1. Check if cv_url column exists and remove it
            print("1. Checking cv_url column...")
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'job_applications' 
                AND column_name = 'cv_url'
            """))
            if result.fetchone():
                print("   - Dropping cv_url column...")
                connection.execute(text("ALTER TABLE job_applications DROP COLUMN cv_url"))
                print("   - cv_url column dropped successfully")
            else:
                print("   - cv_url column already removed")
            
            # 2. Check if required_documents column exists in jobs table
            print("2. Checking required_documents column...")
            result = connection.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'jobs' 
                AND column_name = 'required_documents'
            """))
            if not result.fetchone():
                print("   - Adding required_documents column to jobs table...")
                connection.execute(text("ALTER TABLE jobs ADD COLUMN required_documents JSON"))
                print("   - required_documents column added successfully")
            else:
                print("   - required_documents column already exists")
            
            # 3. Create DocumentType enum if it doesn't exist
            print("3. Checking DocumentType enum...")
            result = connection.execute(text("""
                SELECT 1 FROM pg_type WHERE typname = 'documenttype'
            """))
            if not result.fetchone():
                print("   - Creating DocumentType enum...")
                connection.execute(text("""
                    CREATE TYPE documenttype AS ENUM (
                        'cv', 'passport', 'birth_certificate', 'kcse_certificate',
                        'kcpe_certificate', 'certificate_of_good_conduct', 'academic_transcripts',
                        'professional_certificate', 'work_permit', 'police_clearance',
                        'medical_certificate', 'other'
                    )
                """))
                print("   - DocumentType enum created successfully")
            else:
                print("   - DocumentType enum already exists")
            
            # 4. Check if application_documents table exists
            print("4. Checking application_documents table...")
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'application_documents'
            """))
            if not result.fetchone():
                print("   - Creating application_documents table...")
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
                connection.execute(text("CREATE INDEX ix_application_documents_id ON application_documents (id)"))
                print("   - application_documents table created successfully")
            else:
                print("   - application_documents table already exists")
            
            # 5. Set default required_documents for existing jobs
            print("5. Setting default required_documents for existing jobs...")
            connection.execute(text("""
                UPDATE jobs 
                SET required_documents = '["cv"]'::json 
                WHERE required_documents IS NULL
            """))
            print("   - Default required_documents set for existing jobs")
            
            connection.commit()
            print("\n✅ Migration completed successfully!")
            print("Your FastAPI application should now work with the flexible document system.")
            
        except Exception as e:
            connection.rollback()
            print(f"\n❌ Migration failed: {e}")
            raise

if __name__ == "__main__":
    migrate_to_flexible_documents()
