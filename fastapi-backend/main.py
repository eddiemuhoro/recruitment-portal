from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import jobs, applications

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Portal API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(applications.router, prefix="/api", tags=["applications"])

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