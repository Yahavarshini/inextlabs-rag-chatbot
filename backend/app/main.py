import uuid

import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.chat import delete_session, get_history, save_message
from app.config import settings
from app.models import ChatRequest, ChatResponse, HistoryResponse, SessionResponse
from app.rag import rag_engine
from app.system_prompt import SYSTEM_PROMPT

genai.configure(api_key=settings.gemini_api_key)

app = FastAPI(
    title="InextLabs RAG Chatbot API",
    description="AI-powered customer support chatbot using RAG, FAISS, and Gemini",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = genai.GenerativeModel("gemini-1.5-flash")


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "service": "InextLabs RAG Chatbot API"}


@app.post("/api/session", response_model=SessionResponse)
async def create_session():
    return SessionResponse(session_id=str(uuid.uuid4()))


@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

    # Retrieve relevant context chunks from the FAISS index
    context_chunks = rag_engine.retrieve(request.message, top_k=4)
    context = "\n\n---\n\n".join(context_chunks)

    # Load recent conversation history from MongoDB
    raw_history = await get_history(session_id, limit=10)

    # Format history into Gemini's expected format
    chat_history = [
        {
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [{"text": msg["content"]}],
        }
        for msg in raw_history
    ]

    # Compose the full user turn with system prompt + context
    user_turn = (
        f"{SYSTEM_PROMPT}\n\n"
        f"=== Relevant Knowledge Base Context ===\n{context}\n"
        f"=== End of Context ===\n\n"
        f"User: {request.message}"
    )

    # Persist user message
    await save_message(session_id, "user", request.message)

    # Generate response via Gemini
    chat_session = llm.start_chat(history=chat_history)
    response = chat_session.send_message(user_turn)
    answer = response.text

    # Persist assistant response
    await save_message(session_id, "assistant", answer)

    return ChatResponse(
        session_id=session_id,
        message=answer,
        sources=context_chunks[:2],
    )


@app.get("/api/history/{session_id}", response_model=HistoryResponse)
async def get_chat_history(session_id: str):
    messages = await get_history(session_id, limit=50)
    return HistoryResponse(session_id=session_id, messages=messages)


@app.delete("/api/session/{session_id}")
async def clear_session(session_id: str):
    deleted = await delete_session(session_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": "Session cleared successfully"}
