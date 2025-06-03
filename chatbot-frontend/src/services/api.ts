import axios from 'axios';
import type { ChatResponse } from '../types/chat';
import { getMockResponse } from './mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

interface SendMessageParams {
  message: string;
  model?: string;
  onData: (data: string) => void;
  onEnd: (finalData?: Partial<ChatResponse>) => void;
  onError: (error: Error) => void;
}

// Manter o axios para outras chamadas se necessário, ou remover se só usarmos fetch
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

export async function sendMessage(
  message: string,
  onChunk: (chunk: string) => void,
  model: string = 'llama2'
): Promise<void> {
  if (USE_MOCK) {
    const mockResponse = getMockResponse(message);
    
    // Simular streaming do texto
    const words = mockResponse.message.split(' ');
    let accumulatedText = '';
    for (const word of words) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Delay de 100ms entre palavras
      accumulatedText += word + ' ';
      onChunk(JSON.stringify({ content: accumulatedText }));
    }
    
    // Enviar blocos de código após o texto
    if (mockResponse.codeBlocks) {
      for (const block of mockResponse.codeBlocks) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay de 500ms antes de cada bloco
        onChunk(JSON.stringify({ type: 'codeBlock', codeBlock: block }));
      }
    }
    
    // Enviar arquivos por último
    if (mockResponse.files) {
      for (const file of mockResponse.files) {
        await new Promise(resolve => setTimeout(resolve, 500)); // Delay de 500ms antes de cada arquivo
        onChunk(JSON.stringify({ type: 'file', file }));
      }
    }

    // Simular envio de blocos de código
    if (words.length === 5) {
      const codeBlock = {
        type: 'codeBlock',
        codeBlock: {
          language: 'python',
          code: 'def saudacao(nome):\n    return f"Olá, {nome}!"\n\nprint(saudacao("Mundo"))',
          isEditable: true
        }
      };
      onChunk(JSON.stringify(codeBlock));
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return;
  }

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, model }),
    });

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Não foi possível obter o leitor da resposta');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const data = JSON.parse(jsonStr);
              onChunk(JSON.stringify(data));
            } catch {
              onChunk(jsonStr);
            }
          }
        }
      }
    }

    // Processar qualquer dado restante no buffer
    if (buffer.trim()) {
      if (buffer.startsWith('data: ')) {
        const jsonStr = buffer.slice(6);
        try {
          const data = JSON.parse(jsonStr);
          onChunk(JSON.stringify(data));
        } catch {
          onChunk(jsonStr);
        }
      }
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    throw error;
  }
}

export const downloadFile = async (filename: string): Promise<Blob> => {
  if (USE_MOCK) {
    // Simula o download de um arquivo mock
    const mockContent = 'Este é um arquivo de exemplo';
    return new Blob([mockContent], { type: 'text/plain' });
  }

  try {
    const response = await fetch(`${API_URL}/files/${filename}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erro ao baixar arquivo');
    }

    return response.blob();
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Erro ao baixar arquivo');
    }
    throw error;
  }
}; 