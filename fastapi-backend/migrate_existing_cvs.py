from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def migrate_existing_cvs():
    """Migrate existing CV URLs to the new documents table"""
    engine = create_engine(DATABASE_URL)
    with engine.connect() as connection:
        # Get all existing applications with CV URLs
        result = connection.execute(text("""
            SELECT id, cv_url 
            FROM job_applications 
            WHERE cv_url IS NOT NULL AND cv_url != ''
        """))
        
        applications = result.fetchall()
        print(f"Found {len(applications)} applications with CV URLs to migrate")
        
        # For each application, create a document record
        for app_id, cv_url in applications:
            connection.execute(text("""
                INSERT INTO application_documents 
                (application_id, document_type, document_url, document_name, uploaded_at)
                VALUES (:app_id, 'cv', :cv_url, 'CV.pdf', NOW())
            """), {"app_id": app_id, "cv_url": cv_url})
        
        connection.commit()
        print(f"Successfully migrated {len(applications)} CV records to documents table")

if __name__ == "__main__":
    migrate_existing_cvs()
