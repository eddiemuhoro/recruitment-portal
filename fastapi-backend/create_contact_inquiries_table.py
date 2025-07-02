#!/usr/bin/env python3
"""
Migration script to create the contact_inquiries table.
This script adds support for general contact form submissions.
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text, Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.orm import sessionmaker
from database import DATABASE_URL, Base
from models import ContactInquiry
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_contact_inquiries_table():
    """Create the contact_inquiries table."""
    try:
        # Get database connection
        engine = create_engine(DATABASE_URL)
        
        logger.info("Creating contact_inquiries table...")
        
        # Create the table using SQLAlchemy
        ContactInquiry.__table__.create(engine, checkfirst=True)
        
        logger.info("contact_inquiries table created successfully!")
        
        # Verify the table was created
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_name = 'contact_inquiries'
            """))
            
            if result.fetchone():
                logger.info("✓ contact_inquiries table verified in database")
            else:
                logger.error("✗ contact_inquiries table not found after creation")
                return False
        
        return True
        
    except Exception as e:
        logger.error(f"Error creating contact_inquiries table: {e}")
        return False

def verify_table_structure():
    """Verify the contact_inquiries table has the correct structure."""
    try:
        engine = create_engine(DATABASE_URL)
        
        with engine.connect() as conn:
            # Check columns
            result = conn.execute(text("""
                SELECT column_name, data_type, is_nullable
                FROM information_schema.columns 
                WHERE table_name = 'contact_inquiries'
                ORDER BY ordinal_position
            """))
            
            columns = result.fetchall()
            logger.info("Table structure:")
            for col in columns:
                logger.info(f"  {col[0]}: {col[1]} (nullable: {col[2]})")
                
        return True
        
    except Exception as e:
        logger.error(f"Error verifying table structure: {e}")
        return False

if __name__ == "__main__":
    logger.info("Starting contact_inquiries table migration...")
    
    # Create the table
    if create_contact_inquiries_table():
        logger.info("✓ Migration completed successfully")
        
        # Verify structure
        verify_table_structure()
    else:
        logger.error("✗ Migration failed")
        sys.exit(1)
