import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, cleanup
from routers import jobs, applications, auth, employer_inquiries, agency_analytics

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(applications.router, prefix="/api", tags=["applications"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(employer_inquiries.router, prefix="/api", tags=["employer-inquiries"])
app.include_router(agency_analytics.router, prefix="/api", tags=["agency-analytics"])

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup database connections on application shutdown"""
    cleanup()

@app.get("/")
def read_root():
    return {"message": "Welcome to Job Portal API"}

@app.get("/db-check")
def db_check():
    try:
        from sqlalchemy import text
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1")).scalar()
        return {"database": "connected", "result": result}
    except Exception as e:
        return {"database": "error", "details": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 