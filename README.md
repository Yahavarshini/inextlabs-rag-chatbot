# InextLabs RAG Chatbot

An AI-powered customer support chatbot built with Retrieval-Augmented Generation (RAG) using FAISS vector search, Google Gemini, MongoDB Atlas for conversation history, and a Next.js frontend following iNextLabs UI standards.

## Architecture

| Layer | Technology |
|-------|-----------|
| Backend | Python + FastAPI |
| Vector DB | FAISS (local, persisted) |
| Embeddings | Gemini `text-embedding-004` |
| LLM | Gemini `gemini-1.5-flash` |
| Knowledge Base | Plain text file |
| Conversation History | MongoDB Atlas |
| Frontend | Next.js 14 + iNextLabs Design System |

## Project Structure

```
inextlabs-rag-chatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application & API endpoints
│   │   ├── rag.py            # FAISS vector search + Gemini embeddings
│   │   ├── chat.py           # MongoDB conversation history
│   │   ├── models.py         # Pydantic request/response models
│   │   ├── config.py         # Environment settings (pydantic-settings)
│   │   └── system_prompt.py  # Chatbot persona, behavior, few-shot examples
│   ├── kb/
│   │   └── inextlabs_faq.txt # Knowledge base document
│   ├── requirements.txt
│   ├── setup_venv.bat        # Windows venv + dependency setup
│   ├── setup_venv.sh         # macOS/Linux venv + dependency setup
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css       # iNextLabs design tokens (CSS variables)
│   ├── components/
│   │   ├── Navbar.tsx        # Sticky 64px navbar with brand + theme toggle
│   │   ├── ChatInterface.tsx # Main chat window with session management
│   │   ├── ChatMessage.tsx   # Individual message bubbles
│   │   ├── ChatInput.tsx     # Auto-growing textarea + send button
│   │   └── ThemeToggle.tsx   # Light/dark mode switch
│   ├── lib/
│   │   ├── api.ts            # Backend API client functions
│   │   └── types.ts          # TypeScript interfaces
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.local.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Google Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)
- MongoDB Atlas cluster — [Free tier available](https://www.mongodb.com/atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the setup script to create a virtual environment and install all dependencies:

   **Windows:**
   ```bat
   setup_venv.bat
   ```

   **macOS / Linux:**
   ```bash
   chmod +x setup_venv.sh && ./setup_venv.sh
   ```

3. Copy and configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your Gemini API key and MongoDB URI.

4. Activate the virtual environment and start the server:

   **Windows:**
   ```bat
   venv\Scripts\activate.bat
   uvicorn app.main:app --reload --port 8000
   ```

   **macOS / Linux:**
   ```bash
   source venv/bin/activate
   uvicorn app.main:app --reload --port 8000
   ```

   On first start, the FAISS index is built automatically from the knowledge base. Subsequent starts load the cached index.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy and configure environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to use the chatbot.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | Yes | — | Google Gemini API key |
| `MONGODB_URI` | Yes | — | MongoDB Atlas connection string |
| `MONGODB_DB_NAME` | No | `inextlabs_chatbot` | MongoDB database name |
| `KB_PATH` | No | `kb/inextlabs_faq.txt` | Path to knowledge base file |
| `FAISS_INDEX_PATH` | No | `faiss_index` | Prefix for FAISS index files |
| `CORS_ORIGINS` | No | `http://localhost:3000` | Comma-separated allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend API base URL |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/session` | Create new chat session |
| `POST` | `/api/chat` | Send message, get RAG-augmented response |
| `GET` | `/api/history/{session_id}` | Retrieve conversation history |
| `DELETE` | `/api/session/{session_id}` | Clear and delete a session |

## How RAG Works

1. On startup, the KB text file is split into 500-character chunks with 50-character overlap
2. Each chunk is embedded using Gemini `text-embedding-004` (768 dimensions)
3. Embeddings are stored in a FAISS `IndexFlatIP` index (cosine similarity via L2 normalization)
4. At query time, the user's message is embedded and the top-4 most similar chunks are retrieved
5. Retrieved chunks + conversation history + system prompt are sent to `gemini-1.5-flash` to generate the response
6. The response and history are persisted to MongoDB Atlas for the session

## UI Design System

The frontend implements the iNextLabs design system:

- **Colors**: CSS variable tokens (`--color-primary: #5B4FE9`, etc.)
- **Typography**: Inter font, consistent scale
- **Spacing**: 4px base grid
- **Dark mode**: `[data-theme="dark"]` CSS overrides
- **Accessibility**: WCAG AA — ARIA roles, keyboard navigation, focus indicators
- **Responsive**: Mobile-first, max container width 1280px

## License

MIT
