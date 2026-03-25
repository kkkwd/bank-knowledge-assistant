export type ChatAskRequest = {
  session_id: number;
  knowledge_base_id: number;
  question: string;
  top_k?: number;
};

export type Citation = {
  document_name: string;
  knowledge_base_name: string;
  chunk_index: number;
  snippet_text: string;
  page_number?: number | null;
};

export type RetrievedChunk = {
  chunk_index: number;
  score: number;
  document_name: string;
  content: string;
  page_number?: number | null;
};

export type ChatAskResponse = {
  answer: string;
  citations: Citation[];
  retrieved_chunks: RetrievedChunk[];
  session_id: number;
};

export type Message = {
  id: number;
  role: string;
  content: string;
  citations_json: string | null;
  retrieval_json: string | null;
  model_name: string | null;
  created_at: string;
};

export type SessionPayload = {
  knowledge_base_id: number;
  title: string;
};

export type SessionDetail = {
  id: number;
  knowledge_base_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
};
