import OpenAI from 'openai';
import type { ChatResponse, CodeBlock, FileDownload } from '../types';

// Função auxiliar para extrair blocos de código Markdown (duplicada do OllamaService, pode ser refatorada)
function extractCodeBlocks(text: string): { textWithoutCode: string; codeBlocks: CodeBlock[] } {
  const codeBlocks: CodeBlock[] = [];
  const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
  let match;
  let lastIndex = 0;
  let textWithoutCode = '';

  // Primeiro, vamos extrair todos os blocos de código
  while ((match = codeBlockRegex.exec(text)) !== null) {
    const language = match[1] || 'auto';
    const code = match[2].trim();

    if (code && code.length > 0) {
      codeBlocks.push({
        language,
        code,
      });
    }
  }

  // Agora vamos reconstruir o texto sem os blocos de código
  let currentText = text;
  codeBlocks.forEach(block => {
    // Remover o bloco de código completo (incluindo os marcadores ```)
    const codeBlockPattern = new RegExp(`\`\`\`${block.language}\\n${block.code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\`\`\``, 'g');
    currentText = currentText.replace(codeBlockPattern, '');
  });

  // Limpar espaços extras e quebras de linha
  textWithoutCode = currentText
    .replace(/\n{3,}/g, '\n\n') // Substituir 3 ou mais quebras de linha por 2
    .trim();

  return { textWithoutCode, codeBlocks };
}

export class OpenAIService {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async chat(message: string, onChunk: (chunk: string) => void): Promise<ChatResponse> {
    const stream = await this.client.chat.completions.create({
      model: this.model,
      messages: [{ role: 'user', content: message }],
      stream: true,
    });

    let fullResponse = '';

    // Coletar a resposta completa enquanto também enviamos os chunks de texto puro
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullResponse += content;
        onChunk(content); // Enviar os chunks de texto puro
      }
    }

    // Após receber a resposta completa, analisar e extrair blocos de código
    const { textWithoutCode, codeBlocks } = extractCodeBlocks(fullResponse);

    // A stream já terminou. Enviar os dados estruturados no payload final.
    return {
      message: textWithoutCode, // Enviar o texto sem o markdown dos blocos
      codeBlocks,
      files: [], // Adicionar lógica para arquivos se necessário
      isStreaming: true,
    };
  }
} 