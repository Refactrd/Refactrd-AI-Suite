// ─── Message Types ───────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface Citation {
  documentName: string;
  chunkContent: string;
  relevanceScore: number;
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  isStreaming?: boolean;
  isError?: boolean;
  errorCode?: ApiError["code"];
  confidence?: "high" | "low" | "uncertain";
  timestamp: Date;
  followUps?: string[];
}

// ─── Chat Types ───────────────────────────────────────────────────────────────

export interface StarterQuestion {
  id: string;
  label: string;
  question: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

// ─── Chat History Types ───────────────────────────────────────────────────────

export interface ChatSession {
  id: string;
  title: string;
  messages: SerializedMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SerializedMessage {
  id: string;
  role: MessageRole;
  content: string;
  citations?: Citation[];
  isError?: boolean;
  errorCode?: ApiError["code"];
  confidence?: "high" | "low" | "uncertain";
  timestamp: string;
  followUps?: string[];
}

// ─── Document Types ───────────────────────────────────────────────────────────

export type IngestionStatus = "queued" | "processing" | "indexed" | "failed";

export interface KoraDocument {
  id: string;
  name: string;
  fileUrl: string;
  status: IngestionStatus;
  chunkCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface QueryRequest {
  question: string;
  conversationId?: string;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  confidence: "high" | "low" | "uncertain";
  latencyMs: number;
}

export interface ApiError {
  message: string;
  code:
    | "RATE_LIMITED"
    | "INPUT_TOO_LONG"
    | "ABUSIVE_INPUT"
    | "UNCLEAR_INPUT"
    | "SERVICE_UNAVAILABLE"
    | "UNCERTAIN";
}

// ─── Suite Types ──────────────────────────────────────────────────────────────

export interface AiProject {
  id: string;
  name: string;
  description: string;
  route: string;
  status: "live" | "building" | "planned";
  category: string;
}

export interface SuiteUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
}