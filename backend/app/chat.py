from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorClient

from app.config import settings

client = AsyncIOMotorClient(settings.mongodb_uri)
db = client[settings.mongodb_db_name]
collection = db["conversations"]


async def save_message(session_id: str, role: str, content: str) -> None:
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
    doc = await collection.find_one({"session_id": session_id})
    if not doc:
        return []
    messages = doc.get("messages", [])
    return messages[-limit:]


async def delete_session(session_id: str) -> bool:
    result = await collection.delete_one({"session_id": session_id})
    return result.deleted_count > 0
