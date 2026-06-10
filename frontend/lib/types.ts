export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

export interface ChatResponse {
  session_id: string;
  message: string;
  sources: string[];
}

export interface HistoryMessage {
  role: string;
  content: string;
  timestamp: string;
}

export interface HistoryResponse {
  session_id: string;
  messages: HistoryMessage[];
}
