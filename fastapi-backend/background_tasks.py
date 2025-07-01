from celery import Celery
import os
from redis_config import get_redis
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Create Celery instance
celery_app = Celery(
    "job_portal",
    broker=os.getenv("REDIS_URL", "redis://localhost:6379"),
    backend=os.getenv("REDIS_URL", "redis://localhost:6379")
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    result_expires=3600,  # Results expire after 1 hour
)

@celery_app.task(bind=True)
def send_email_notification(self, recipient_email: str, subject: str, message: str):
    """Background task to send email notifications"""
    try:
        # Email configuration (use environment variables in production)
        smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        sender_email = os.getenv("SENDER_EMAIL")
        sender_password = os.getenv("SENDER_PASSWORD")
        
        if not sender_email or not sender_password:
            return {"status": "error", "message": "Email credentials not configured"}
        
        # Create message
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = recipient_email
        msg["Subject"] = subject
        
        msg.attach(MIMEText(message, "plain"))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, recipient_email, text)
        server.quit()
        
        return {"status": "success", "message": "Email sent successfully"}
        
    except Exception as e:
        # Retry the task up to 3 times
        if self.request.retries < 3:
            raise self.retry(countdown=60, max_retries=3)
        return {"status": "error", "message": f"Failed to send email: {str(e)}"}

@celery_app.task
def process_job_application(application_id: int):
    """Background task to process job applications"""
    try:
        # Simulate processing (AI screening, background checks, etc.)
        import time
        time.sleep(2)  # Simulate processing time
        
        # Update Redis with processing status
        redis_client = get_redis()
        redis_client.setex(
            f"application_processing:{application_id}",
            3600,  # Expire in 1 hour
            "completed"
        )
        
        return {
            "status": "success", 
            "application_id": application_id,
            "message": "Application processed successfully"
        }
        
    except Exception as e:
        return {
            "status": "error",
            "application_id": application_id, 
            "message": f"Failed to process application: {str(e)}"
        }

@celery_app.task
def generate_daily_reports():
    """Background task to generate daily analytics reports"""
    try:
        from datetime import datetime, timedelta
        from database import get_db
        from models import Job, Application
        
        # Get database session
        db = next(get_db())
        
        # Generate report data
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)
        
        # Count new jobs and applications
        new_jobs = db.query(Job).filter(Job.created_at >= yesterday).count()
        new_applications = db.query(Application).filter(Application.created_at >= yesterday).count()
        
        report_data = {
            "date": str(yesterday),
            "new_jobs": new_jobs,
            "new_applications": new_applications,
            "generated_at": datetime.utcnow().isoformat()
        }
        
        # Store report in Redis
        redis_client = get_redis()
        redis_client.setex(
            f"daily_report:{yesterday}",
            86400 * 7,  # Keep for 7 days
            str(report_data)
        )
        
        return report_data
        
    except Exception as e:
        return {"status": "error", "message": f"Failed to generate report: {str(e)}"}

@celery_app.task
def cleanup_expired_sessions():
    """Background task to cleanup expired sessions"""
    try:
        redis_client = get_redis()
        
        # Get all session keys
        session_keys = redis_client.keys("session:*")
        expired_count = 0
        
        for key in session_keys:
            # Check if key exists (Redis auto-expires keys)
            if not redis_client.exists(key):
                expired_count += 1
        
        return {
            "status": "success",
            "expired_sessions_cleaned": expired_count,
            "message": "Session cleanup completed"
        }
        
    except Exception as e:
        return {"status": "error", "message": f"Failed to cleanup sessions: {str(e)}"}

# Periodic tasks configuration
from celery.schedules import crontab

celery_app.conf.beat_schedule = {
    'generate-daily-reports': {
        'task': 'background_tasks.generate_daily_reports',
        'schedule': crontab(hour=1, minute=0),  # Run daily at 1 AM
    },
    'cleanup-expired-sessions': {
        'task': 'background_tasks.cleanup_expired_sessions', 
        'schedule': crontab(minute=0),  # Run every hour
    },
}
