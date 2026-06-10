from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

# Lazy client — initialized on first use to avoid URI validation at import time
_client: AsyncIOMotorClient | None = None


def _get_collection():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(settings.mongodb_uri)
    db = _client[settings.mongodb_db_name]
    return db["conversations"]


async def save_message(session_id: str, role: str, content: str) -> None:
    collection = _get_collection()
    await collection.update_one(
        {"session_id": session_id},
        {
            "$push": {
                "messages": {
                    "role": role,
                    "content": content,
                    "timestamp": datetime.now(timezone.utc),
                }
            },
            "$setOnInsert": {
                "session_id": session_id,
                "created_at": datetime.now(timezone.utc),
            },
        },
        upsert=True,
    )


async def get_history(session_id: str, limit: int = 10) -> list[dict]:
    collection = _get_collection()
    doc = await collection.find_one({"session_id": session_id})
    if not doc:
        return []
    messages = doc.get("messages", [])
    return messages[-limit:]


async def delete_session(session_id: str) -> bool:
    collection = _get_collection()
    result = await collection.delete_one({"session_id": session_id})
    return result.deleted_count > 0
