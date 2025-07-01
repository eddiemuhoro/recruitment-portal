from fastapi import APIRouter, Depends, HTTPException, Request
from redis_config import get_cache, RedisCache
from typing import Dict, Any, List
import uuid
import json
from datetime import datetime, timedelta

router = APIRouter()

class SessionManager:
    def __init__(self, cache: RedisCache):
        self.cache = cache
        self.session_prefix = "session:"
        self.user_sessions_prefix = "user_sessions:"
    
    def create_session(self, user_id: int, user_data: Dict[str, Any]) -> str:
        """Create a new session"""
        session_id = str(uuid.uuid4())
        session_data = {
            "user_id": user_id,
            "user_data": user_data,
            "created_at": datetime.utcnow().isoformat(),
            "last_accessed": datetime.utcnow().isoformat()
        }
        
        # Store session data (expires in 24 hours)
        self.cache.set(f"{self.session_prefix}{session_id}", session_data, expire=86400)
        
        # Track user sessions
        user_sessions_key = f"{self.user_sessions_prefix}{user_id}"
        user_sessions = self.cache.get(user_sessions_key) or []
        user_sessions.append(session_id)
        self.cache.set(user_sessions_key, user_sessions, expire=86400)
        
        return session_id
    
    def get_session(self, session_id: str) -> Dict[str, Any]:
        """Get session data"""
        session_data = self.cache.get(f"{self.session_prefix}{session_id}")
        if session_data:
            # Update last accessed time
            session_data["last_accessed"] = datetime.utcnow().isoformat()
            self.cache.set(f"{self.session_prefix}{session_id}", session_data, expire=86400)
        return session_data
    
    def delete_session(self, session_id: str) -> bool:
        """Delete a session"""
        session_data = self.get_session(session_id)
        if session_data:
            user_id = session_data.get("user_id")
            
            # Remove from user sessions list
            if user_id:
                user_sessions_key = f"{self.user_sessions_prefix}{user_id}"
                user_sessions = self.cache.get(user_sessions_key) or []
                if session_id in user_sessions:
                    user_sessions.remove(session_id)
                    self.cache.set(user_sessions_key, user_sessions, expire=86400)
            
            # Delete session
            return self.cache.delete(f"{self.session_prefix}{session_id}")
        return False
    
    def get_user_sessions(self, user_id: int) -> List[str]:
        """Get all sessions for a user"""
        return self.cache.get(f"{self.user_sessions_prefix}{user_id}") or []
    
    def delete_all_user_sessions(self, user_id: int) -> bool:
        """Delete all sessions for a user"""
        user_sessions = self.get_user_sessions(user_id)
        for session_id in user_sessions:
            self.cache.delete(f"{self.session_prefix}{session_id}")
        
        return self.cache.delete(f"{self.user_sessions_prefix}{user_id}")

def get_session_manager(cache: RedisCache = Depends(get_cache)) -> SessionManager:
    return SessionManager(cache)

@router.post("/sessions/create")
def create_session(
    user_id: int,
    user_data: Dict[str, Any],
    session_manager: SessionManager = Depends(get_session_manager)
):
    """Create a new user session"""
    session_id = session_manager.create_session(user_id, user_data)
    return {
        "session_id": session_id,
        "message": "Session created successfully"
    }

@router.get("/sessions/{session_id}")  
def get_session(
    session_id: str,
    session_manager: SessionManager = Depends(get_session_manager)
):
    """Get session data"""
    session_data = session_manager.get_session(session_id)
    if not session_data:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return session_data

@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: str,
    session_manager: SessionManager = Depends(get_session_manager)
):
    """Delete a session"""
    success = session_manager.delete_session(session_id)
    if not success:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {"message": "Session deleted successfully"}

@router.get("/sessions/user/{user_id}")
def get_user_sessions(
    user_id: int,
    session_manager: SessionManager = Depends(get_session_manager)
):
    """Get all sessions for a user"""
    sessions = session_manager.get_user_sessions(user_id)
    return {"user_id": user_id, "sessions": sessions}

@router.delete("/sessions/user/{user_id}")
def delete_all_user_sessions(
    user_id: int,
    session_manager: SessionManager = Depends(get_session_manager)
):
    """Delete all sessions for a user (logout from all devices)"""
    success = session_manager.delete_all_user_sessions(user_id)
    return {"message": f"All sessions deleted for user {user_id}"}
