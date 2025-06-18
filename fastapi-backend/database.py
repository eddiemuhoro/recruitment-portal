import os
from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.pool import QueuePool
from dotenv import load_dotenv
import logging
import time
from contextlib import contextmanager

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Configure logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)

# Create engine with optimized pool settings for Supabase
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=1,  # Keep at 1 to stay within Supabase limits
    max_overflow=1,  # Reduced to 1 to prevent connection spikes
    pool_timeout=30,  # Wait up to 30 seconds for a connection
    pool_recycle=300,  # Recycle connections every 5 minutes
    pool_pre_ping=True,  # Enable connection health checks
    echo=False
)

# Create a scoped session factory
SessionLocal = scoped_session(
    sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
)

Base = declarative_base()

# Add event listeners for connection pool management
@event.listens_for(engine, 'checkout')
def receive_checkout(dbapi_connection, connection_record, connection_proxy):
    """Log when a connection is checked out from the pool"""
    logging.info('Connection checked out from pool')

@event.listens_for(engine, 'checkin')
def receive_checkin(dbapi_connection, connection_record):
    """Log when a connection is returned to the pool"""
    logging.info('Connection returned to pool')

@contextmanager
def get_db_session():
    """Context manager for database sessions with proper cleanup"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        SessionLocal.remove()

def get_db():
    """Get database session with proper cleanup and retry logic"""
    max_retries = 3
    retry_delay = 1  # seconds
    
    for attempt in range(max_retries):
        try:
            with get_db_session() as db:
                yield db
            break
        except Exception as e:
            if attempt == max_retries - 1:  # Last attempt
                raise e
            logging.warning(f"Database connection attempt {attempt + 1} failed, retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
            retry_delay *= 2  # Exponential backoff

# Cleanup function to be called during application shutdown
def cleanup():
    """Cleanup database connections"""
    SessionLocal.remove()
    engine.dispose() 