import { useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Message, ChatState, ChatResponse, CodeBlock, FileDownload } from '../types/chat';
import { sendMessage as sendMessageToAPI } from '../services/api';
import { getMockResponse } from '../services/mockData';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

// Função auxiliar para encontrar e atualizar um bloco de código
const updateCodeBlock = (messages: Message[], messageId: string, blockIndex: number, newCode: string): Message[] => {
  return messages.map(msg => {
    if (msg.id === messageId && msg.codeBlocks && msg.codeBlocks[blockIndex]) {
      // Criar uma cópia da mensagem e do codeBlocks para não mutar o estado diretamente
      const updatedMessage = { ...msg };
      updatedMessage.codeBlocks = [...msg.codeBlocks];
      updatedMessage.codeBlocks[blockIndex] = { ...updatedMessage.codeBlocks[blockIndex], code: newCode };
      return updatedMessage;
    }
    return msg;
  });
};

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  availableModels: string[];
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  clearChat: () => void;
  handleCodeEdited: (messageId: string, blockIndex: number, newCode: string) => void;
}

export function useChat(): UseChatReturn {
  const [state, setState] = useState<ChatState>(initialState);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModelState, setSelectedModelState] = useState<string>('');

  const selectedModelRef = useRef(selectedModelState);

  useEffect(() => {
    selectedModelRef.current = selectedModelState;
  }, [selectedModelState]);

  useEffect(() => {
    const fetchModels = async () => {
      if (USE_MOCK) {
        setAvailableModels(['llama2 (mock)', 'gpt-4 (mock)']);
        setSelectedModelState('llama2 (mock)');
        return;
      }

      try {
        const response = await fetch('/models');
        if (!response.ok) {
          throw new Error('Erro ao buscar modelos');
        }
        const data = await response.json();
        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models);
          const defaultModel = data.models.find((model: string) => model === 'gpt-4') || data.models[0];
          setSelectedModelState(defaultModel);
        } else {
          setAvailableModels(['llama2 (fallback)', 'gpt-4 (fallback)']);
          setSelectedModelState('llama2 (fallback)');
        }
      } catch (error: any) {
        console.error('Erro ao buscar modelos:', error);
        setAvailableModels(['llama2 (fallback)', 'gpt-4 (fallback)']);
        setSelectedModelState('llama2 (fallback)');
      }
    };

    fetchModels();
  }, []);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant', id?: string) => {
    const newMessage: Message = {
      id: id || uuidv4(),
      content,
      role,
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
    }));
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, content: string) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map(msg => 
        msg.id === id ? { ...msg, content: msg.content + content } : msg
      )
    }));
  }, []);
  
  const finalizeStreamingMessage = useCallback((id: string, finalData: Partial<ChatResponse>) => {
    setState((prev) => ({
      ...prev,
      messages: prev.messages.map(msg => {
        if (msg.id === id) {
          const updatedMessage = { ...msg };
          if (finalData?.codeBlocks) {
            updatedMessage.codeBlocks = finalData.codeBlocks;
          }
          if (finalData?.files) {
            updatedMessage.files = finalData.files;
          }
          return updatedMessage;
        }
        return msg;
      })
    }));
    setStreamingMessageId(null);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      let assistantMessageId: string;
      
      // Adicionar mensagem do assistente
      assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
      }));

      // Simula uma resposta da API
      const response = getMockResponse(content);
      
      // Atualizar a mensagem do assistente com o conteúdo real
      setState(prev => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: response.message,
                codeBlocks: response.codeBlocks,
                files: response.files,
              }
            : msg
        ),
        isLoading: false,
      }));
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Atualizar a mensagem do assistente com erro
      setState(prev => ({
        ...prev,
        messages: prev.messages.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                content: 'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
              }
            : msg
        ),
        isLoading: false,
      }));
    }
  }, []);

  const clearChat = useCallback(() => {
    setState(initialState);
    setStreamingMessageId(null);
  }, []);

  const handleCodeEdited = useCallback((messageId: string, blockIndex: number, newCode: string) => {
    setState(prev => ({
      ...prev,
      messages: updateCodeBlock(prev.messages, messageId, blockIndex, newCode)
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage: handleSendMessage,
    clearChat,
    handleCodeEdited,
    availableModels,
    selectedModel: selectedModelState,
    setSelectedModel: setSelectedModelState,
  };
} 