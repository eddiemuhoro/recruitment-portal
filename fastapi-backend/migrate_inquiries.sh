#!/bin/bash

# Script to update the employer inquiries table with advanced management fields
# Run this in the fastapi-backend directory

echo "Adding advanced inquiry management fields to database..."

# Add the new columns using raw SQL
python3 -c "
import sqlite3
from datetime import datetime

# Connect to the database
conn = sqlite3.connect('recruitment_portal.db')
cursor = conn.cursor()

try:
    # Add status column (default to 'new')
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN status TEXT DEFAULT \"new\"')
        print('Added status column')
    except sqlite3.OperationalError:
        print('Status column already exists')
    
    # Add priority column (default to 'medium')
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN priority TEXT DEFAULT \"medium\"')
        print('Added priority column')
    except sqlite3.OperationalError:
        print('Priority column already exists')
    
    # Add admin_notes column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN admin_notes TEXT')
        print('Added admin_notes column')
    except sqlite3.OperationalError:
        print('Admin_notes column already exists')
    
    # Add admin_response column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN admin_response TEXT')
        print('Added admin_response column')
    except sqlite3.OperationalError:
        print('Admin_response column already exists')
    
    # Add assigned_to column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN assigned_to TEXT')
        print('Added assigned_to column')
    except sqlite3.OperationalError:
        print('Assigned_to column already exists')
    
    # Add responded_at column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN responded_at DATETIME')
        print('Added responded_at column')
    except sqlite3.OperationalError:
        print('Responded_at column already exists')
    
    # Add resolved_at column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN resolved_at DATETIME')
        print('Added resolved_at column')
    except sqlite3.OperationalError:
        print('Resolved_at column already exists')
    
    # Add updated_at column
    try:
        cursor.execute('ALTER TABLE employer_inquiries ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP')
        print('Added updated_at column')
    except sqlite3.OperationalError:
        print('Updated_at column already exists')
    
    # Update existing records to have updated_at = created_at
    cursor.execute('UPDATE employer_inquiries SET updated_at = created_at WHERE updated_at IS NULL')
    print('Updated existing records with updated_at timestamps')
    
    conn.commit()
    print('Migration completed successfully!')
    
except Exception as e:
    print(f'Error during migration: {e}')
    conn.rollback()
    
finally:
    conn.close()
"

echo "Migration script completed."
