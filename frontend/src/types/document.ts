export type DocumentRecord = {
  id: number;
  knowledge_base_id: number;
  file_name: string;
  original_name: string;
  file_type: string;
  storage_path: string;
  parse_status: string;
  index_status: string;
  chunk_count: number;
  error_message: string | null;
  uploaded_at: string;
  updated_at: string;
};

export type UploadDocumentResponse = {
  document_id: number;
  status: string;
  file_name: string;
};

export type ReindexDocumentResponse = {
  document_id: number;
  status: string;
};
