import { Ollama } from 'ollama';
import type { ChatResponse, CodeBlock, FileDownload } from '../types';

export class OllamaService {
  private client: Ollama;
  private defaultModel: string;

  constructor(baseUrl: string, defaultModel: string) {
    this.client = new Ollama({ host: baseUrl });
    this.defaultModel = defaultModel;
  }

  async chat(message: string, onChunk: (chunk: string) => void, model: string = this.defaultModel): Promise<ChatResponse> {
    const stream = await this.client.chat({
      model: model,
      messages: [{ role: 'user', content: message }],
      stream: true,
    });

    let fullResponse = '';
    let currentCodeBlock: { language: string; code: string } | null = null;
    let textWithoutCode = '';

    // Coletar a resposta completa enquanto também enviamos os chunks de texto puro
    for await (const chunk of stream) {
      const content = chunk.message.content;
      fullResponse += content;

      // Processar o chunk para detectar blocos de código
      if (content.includes('```')) {
        const parts = content.split('```');
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i];
          
          if (i % 2 === 0) {
            // Texto normal
            if (currentCodeBlock) {
              // Se estamos dentro de um bloco de código, adicionar ao código
              currentCodeBlock.code += part;
            } else {
              // Se estamos fora de um bloco de código, adicionar ao texto
              textWithoutCode += part;
              onChunk(part);
            }
          } else {
            // Início ou fim de bloco de código
            if (currentCodeBlock) {
              // Fim do bloco de código
              onChunk(JSON.stringify({
                type: 'codeBlock',
                codeBlock: currentCodeBlock
              }));
              currentCodeBlock = null;
            } else {
              // Início do bloco de código
              const language = part.trim() || 'auto';
              currentCodeBlock = { language, code: '' };
            }
          }
        }
      } else if (content.includes('{"type":"codeBlock"')) {
        // Se o conteúdo contém um bloco de código em formato JSON
        try {
          const jsonStart = content.indexOf('{"type":"codeBlock"');
          const jsonEnd = content.indexOf('}', jsonStart) + 1;
          const jsonStr = content.substring(jsonStart, jsonEnd);
          const data = JSON.parse(jsonStr);
          
          if (data.type === 'codeBlock') {
            onChunk(jsonStr);
            // Adicionar o texto antes do JSON
            const textBefore = content.substring(0, jsonStart);
            if (textBefore) {
              textWithoutCode += textBefore;
              onChunk(textBefore);
            }
            // Adicionar o texto depois do JSON
            const textAfter = content.substring(jsonEnd);
            if (textAfter) {
              textWithoutCode += textAfter;
              onChunk(textAfter);
            }
          }
        } catch (error) {
          // Se não conseguir processar como JSON, tratar como texto normal
          textWithoutCode += content;
          onChunk(content);
        }
      } else {
        // Se não há marcadores de código, adicionar ao texto ou código atual
        if (currentCodeBlock) {
          currentCodeBlock.code += content;
        } else {
          textWithoutCode += content;
          onChunk(content);
        }
      }
    }

    // Se ainda houver um bloco de código aberto no final, fechá-lo
    if (currentCodeBlock) {
      onChunk(JSON.stringify({
        type: 'codeBlock',
        codeBlock: currentCodeBlock
      }));
    }

    return {
      message: textWithoutCode.trim(),
      codeBlocks: [], // Os blocos de código já foram enviados durante o streaming
      files: [],
      isStreaming: true,
    };
  }

  // Método para listar modelos disponíveis
  async listModels(): Promise<string[]> {
    try {
      const models = await this.client.list();
      return models.models.map(model => model.name);
    } catch (error) {
      console.error('Erro ao listar modelos:', error);
      return [this.defaultModel, 'llama3.2:3b-instruct-q4_0', 'gpt-4'].filter(Boolean);
    }
  }
} 