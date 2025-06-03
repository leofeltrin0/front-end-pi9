export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  codeBlocks?: CodeBlock[];
  files?: FileDownload[];
  isStreaming?: boolean;
  images?: string[];
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
  images?: string[];
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
} 