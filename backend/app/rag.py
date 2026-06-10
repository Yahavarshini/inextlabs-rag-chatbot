import os
import pickle

import faiss
import google.generativeai as genai
import numpy as np
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import settings

genai.configure(api_key=settings.gemini_api_key)

EMBEDDING_MODEL = "models/text-embedding-004"
EMBEDDING_DIMENSION = 768


def get_embedding(text: str) -> list:
    result = genai.embed_content(
        model=EMBEDDING_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


class RAGEngine:
    def __init__(self) -> None:
        self.index = None
        self.chunks: list[str] = []
        self._load_or_build_index()

    def _load_or_build_index(self) -> None:
        index_path = settings.faiss_index_path + ".index"
        chunks_path = settings.faiss_index_path + ".pkl"

        if os.path.exists(index_path) and os.path.exists(chunks_path):
            self.index = faiss.read_index(index_path)
            with open(chunks_path, "rb") as f:
                self.chunks = pickle.load(f)
            print(f"[RAG] Loaded existing FAISS index with {len(self.chunks)} chunks.")
        else:
            print("[RAG] Building new FAISS index from knowledge base...")
            self._build_index()

    def _build_index(self) -> None:
        with open(settings.kb_path, "r", encoding="utf-8") as f:
            text = f.read()

        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separators=["\n\n", "\n", ".", " "],
        )
        self.chunks = splitter.split_text(text)

        embeddings = []
        for i, chunk in enumerate(self.chunks):
            emb = get_embedding(chunk)
            embeddings.append(emb)
            print(f"[RAG] Embedded chunk {i + 1}/{len(self.chunks)}")

        emb_array = np.array(embeddings, dtype=np.float32)
        faiss.normalize_L2(emb_array)

        self.index = faiss.IndexFlatIP(EMBEDDING_DIMENSION)
        self.index.add(emb_array)

        faiss.write_index(self.index, settings.faiss_index_path + ".index")
        with open(settings.faiss_index_path + ".pkl", "wb") as f:
            pickle.dump(self.chunks, f)

        print(f"[RAG] Built and saved FAISS index with {len(self.chunks)} chunks.")

    def retrieve(self, query: str, top_k: int = 4) -> list[str]:
        query_emb = np.array([get_embedding(query)], dtype=np.float32)
        faiss.normalize_L2(query_emb)
        distances, indices = self.index.search(query_emb, top_k)
        return [self.chunks[i] for i in indices[0] if 0 <= i < len(self.chunks)]


rag_engine = RAGEngine()
