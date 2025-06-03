import type { ChatResponse } from '../types/chat';
import { mockResponses } from '../mockData';

export function getMockResponse(message: string): ChatResponse {
  const lowerMessage = message.toLowerCase();
  
  // Verificar se a mensagem contém alguma das palavras-chave
  for (const key in mockResponses) {
    if (lowerMessage.includes(key)) {
      const response = mockResponses[key];
      return {
        message: response.message,
        codeBlocks: response.codeBlocks || [],
        files: response.files || [],
        images: response.images || []
      };
    }
  }
  
  // Resposta padrão se nenhuma palavra-chave for encontrada
  return {
    message: '[Chain of Thought]\nAnalisando a mensagem...\n\nProcessando informações...\n\nGerando resposta...\n\nDesculpe, não entendi completamente sua solicitação. Poderia reformular ou fornecer mais detalhes?',
    codeBlocks: [],
    files: [],
    images: []
  };
} 