import redis
import os
from typing import Optional
import json
import logging

logger = logging.getLogger(__name__)

class RedisClient:
    def __init__(self):
        self.redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
        self.redis_client: Optional[redis.Redis] = None
    
    def get_redis_client(self) -> redis.Redis:
        """Get synchronous Redis client"""
        if not self.redis_client:
            self.redis_client = redis.from_url(
                self.redis_url, 
                decode_responses=True,
                health_check_interval=30,
                socket_connect_timeout=5,
                socket_timeout=5
            )
        return self.redis_client
    
    def close(self):
        """Close Redis connections"""
        if self.redis_client:
            self.redis_client.close()

# Global Redis instance
redis_client = RedisClient()

def get_redis() -> redis.Redis:
    """Dependency to get Redis client"""
    return redis_client.get_redis_client()

# Cache decorations and utilities
class RedisCache:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
    
    def get(self, key: str):
        """Get value from cache"""
        try:
            value = self.redis.get(key)
            if value:
                return json.loads(value)
            return None
        except Exception as e:
            logger.error(f"Redis get error: {e}")
            return None
    
    def set(self, key: str, value, expire: int = 3600):
        """Set value in cache with expiration (default 1 hour)"""
        try:
            serialized_value = json.dumps(value, default=str)
            return self.redis.setex(key, expire, serialized_value)
        except Exception as e:
            logger.error(f"Redis set error: {e}")
            return False
    
    def delete(self, key: str):
        """Delete key from cache"""
        try:
            return self.redis.delete(key)
        except Exception as e:
            logger.error(f"Redis delete error: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists"""
        try:
            return bool(self.redis.exists(key))
        except Exception as e:
            logger.error(f"Redis exists error: {e}")
            return False

def get_cache() -> RedisCache:
    """Dependency to get Redis cache"""
    return RedisCache(get_redis())
