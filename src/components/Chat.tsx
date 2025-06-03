import React, { useState } from 'react';
import { ChatMessage } from '../../chatbot-frontend/src/components/ChatMessage';
import { usePyodide } from '../../chatbot-frontend/src/hooks/usePyodide';

export const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: 'Olá! Peça para eu "plotar grafico" para ver um exemplo.',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);

  const { pyodideStatus, executePythonCode } = usePyodide();

  const handleSend = (msg: string) => {
    const userMsg = {
      id: (messages.length + 1).toString(),
      content: msg,
      role: 'user',
      timestamp: new Date(),
    };
    let newMessages = [...messages, userMsg];
    if (msg.trim().toLowerCase() === 'plotar grafico') {
      newMessages = [
        ...newMessages,
        {
          id: (newMessages.length + 1).toString(),
          content: 'Claro! Aqui está um exemplo de código Python que plota um gráfico simples com matplotlib:',
          role: 'assistant',
          timestamp: new Date(),
          codeBlocks: [
            {
              code: `import matplotlib.pyplot as plt\nimport numpy as np\nx = np.linspace(0, 2 * np.pi, 100)\ny = np.sin(x)\nplt.figure(figsize=(6,4))\nplt.plot(x, y)\nplt.title('Seno de x')\nplt.xlabel('x')\nplt.ylabel('sen(x)')`,
              language: 'python',
            },
          ],
        },
      ];
    }
    setMessages(newMessages);
  };

  const handleCodeEdited = (messageId: string, blockIndex: number, newCode: string) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => {
        if (msg.id === messageId && msg.codeBlocks) {
          const updatedBlocks = [...msg.codeBlocks];
          updatedBlocks[blockIndex] = { ...updatedBlocks[blockIndex], code: newCode };
          return { ...msg, codeBlocks: updatedBlocks };
        }
        return msg;
      })
    );
  };

  const [input, setInput] = useState('');

  return (
    <div className="flex h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-xl font-semibold">Chatbot IA</h1>
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
      <form className="flex items-end gap-2 border-t p-4" onSubmit={e => { e.preventDefault(); handleSend(input); setInput(''); }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          rows={1}
        />
        <button
          type="submit"
          disabled={!input.trim()}
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