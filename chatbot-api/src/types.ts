export interface ChatRequest {
  message: string;
  model?: string;
}

export interface CodeBlock {
  language: string;
  code: string;
  filename?: string;
}

export interface FileDownload {
  filename: string;
  content: string;
  language: string;
}

export interface ChatResponse {
  message: string;
  codeBlocks?: CodeBlock[];
  files?: FileDownload[];
  isStreaming?: boolean;
} 