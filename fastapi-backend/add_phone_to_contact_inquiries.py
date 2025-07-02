#!/usr/bin/env python3
"""
Migration script to add phone column to contact_inquiries table.
This allows users to provide phone numbers for WhatsApp/SMS responses.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from database import DATABASE_URL
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def add_phone_column():
    """Add phone column to contact_inquiries table."""
    try:
        # Get database connection
        engine = create_engine(DATABASE_URL)
        
        logger.info("Adding phone column to contact_inquiries table...")
        
        with engine.connect() as conn:
            # Check if column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'contact_inquiries' 
                AND column_name = 'phone'
            """))
            
            if result.fetchone():
                logger.info("✓ Phone column already exists")
                return True
            
            # Add the phone column
            conn.execute(text("""
                ALTER TABLE contact_inquiries 
                ADD COLUMN phone VARCHAR(50)
            """))
            
            conn.commit()
            logger.info("✓ Phone column added successfully!")
            
        return True
        
    except Exception as e:
        logger.error(f"Error adding phone column: {e}")
        return False

def verify_column_added():
    """Verify the phone column was added correctly."""
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # Check table structure
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'contact_inquiries'
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            logger.info("Updated table structure:")
            for col in columns:
                logger.info(f"  {col[0]}: {col[1]} (nullable: {col[2]})")
                
        return True
        
    except Exception as e:
        logger.error(f"Error verifying column: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting phone column migration...")
    
    # Add the column
    if add_phone_column():
        logger.info("✓ Migration completed successfully")
        
        # Verify structure
        verify_column_added()
    else:
        logger.error("✗ Migration failed")
        sys.exit(1)
