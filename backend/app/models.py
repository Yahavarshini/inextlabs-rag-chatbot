from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    message: str
    sources: list[str] = []


class MessageItem(BaseModel):
    role: str
    content: str
    timestamp: Optional[datetime] = None


class HistoryResponse(BaseModel):
    session_id: str
    messages: list[MessageItem]


class SessionResponse(BaseModel):
    session_id: str
