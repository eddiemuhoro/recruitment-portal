import uvicorn
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, cleanup
from routers import jobs, applications, auth, employer_inquiries, agency_analytics, sessions
from redis_config import redis_client

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    # Create database tables
    Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    cleanup()
    redis_client.close()

app = FastAPI(
    title="Job Portal API",
    description="Skyways Global Recruitment Portal API with Redis Caching",
    version="1.0.0",
    lifespan=lifespan
)


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
app.include_router(sessions.router, prefix="/api", tags=["sessions"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Job Portal API with Redis"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/db-check")
def db_check():
    try:
        from sqlalchemy import text
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1")).scalar()
        return {"database": "connected", "result": result}
    except Exception as e:
        return {"database": "error", "details": str(e)}

@app.get("/redis-check")
def redis_check():
    try:
        redis = redis_client.get_redis_client()
        redis.ping()
        info = redis.info()
        return {
            "redis": "connected",
            "version": info.get("redis_version"),
            "used_memory": info.get("used_memory_human"),
            "connected_clients": info.get("connected_clients")
        }
    except Exception as e:
        return {"redis": "error", "details": str(e)}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)