import React, { useState, useCallback } from 'react';
import { ChatMessage } from './ChatMessage';
import { usePyodide } from '../hooks/usePyodide';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types/chat';

const Chat = () => {
  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
    handleCodeEdited,
  } = useChat();

  const { pyodideStatus, executePythonCode } = usePyodide();
  const [input, setInput] = useState('');

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    await sendMessage(content);
    setInput('');
  }, [sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-semibold">Arachinidata IA</h1>
        <button
          onClick={clearChat}
          className="rounded-md bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
        >
          Limpar Chat
        </button>
      </header>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            pyodideStatus={pyodideStatus}
            executePythonCode={executePythonCode}
            onCodeEdited={handleCodeEdited}
          />
        ))}
      </div>
      <form 
        className="flex items-end gap-2 border-t p-4" 
        onSubmit={e => { 
          e.preventDefault(); 
          handleSendMessage(input);
        }}
      >
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default Chat; 