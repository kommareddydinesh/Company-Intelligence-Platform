import json
import logging
from typing import Optional, Any
import redis.asyncio as aioredis
from backend.config import settings

logger = logging.getLogger(__name__)

class RedisCache:
    def __init__(self):
        self.redis_url = getattr(settings, "REDIS_URL", "redis://localhost:6379/0")
        self._client: Optional[aioredis.Redis] = None

    async def connect(self):
        try:
            self._client = aioredis.from_url(self.redis_url, encoding="utf-8", decode_responses=True)
            await self._client.ping()
            logger.info("Connected to Redis Cache successfully.")
        except Exception as e:
            logger.warning(f"Redis connection notice ({e}). Operating in memory fallback mode.")
            self._client = None

    async def get(self, key: str) -> Optional[Any]:
        if not self._client:
            return None
        try:
            val = await self._client.get(key)
            return json.loads(val) if val else None
        except Exception:
            return None

    async def set(self, key: str, value: Any, expire_seconds: int = 3600):
        if not self._client:
            return
        try:
            await self._client.set(key, json.dumps(value), ex=expire_seconds)
        except Exception as e:
            logger.warning(f"Failed to set Redis key {key}: {e}")

redis_cache = RedisCache()
