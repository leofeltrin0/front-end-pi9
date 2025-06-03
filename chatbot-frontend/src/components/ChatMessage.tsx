import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Message } from '../types/chat';
import { FileDownload } from './FileDownload';
import { ThinkingAnimation } from './ThinkingAnimation';

interface ChatMessageProps {
  message: Message;
  pyodideStatus: {
    pyodide: any;
    isLoading: boolean;
  };
  executePythonCode: (code: string) => Promise<{ output: string; error?: string; plot?: string }>;
  onCodeEdited: (messageId: string, blockIndex: number, newCode: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  pyodideStatus,
  executePythonCode,
  onCodeEdited,
  onEdit,
}) => {
  const [editingBlockIndex, setEditingBlockIndex] = useState<number | null>(null);
  const [editedCode, setEditedCode] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [realContent, setRealContent] = useState('');
  const [displayedContent, setDisplayedContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const [executionStates, setExecutionStates] = useState<Record<number, { isExecuting: boolean; result: any }>>({});

  useEffect(() => {
    // Separar o chain-of-thought do conteúdo real
    const parts = message.content.split('[Chain of Thought]');
    if (parts.length > 1) {
      setShowThinking(true);
      setRealContent(parts[1].trim());
      setDisplayedContent('');
    } else {
      setRealContent(message.content);
      setDisplayedContent(message.content);
    }
  }, [message.content]);

  useEffect(() => {
    if (showThinking && realContent) {
      const lines = realContent.split('\n');
      let currentLine = 0;

      const interval = setInterval(() => {
        if (currentLine < lines.length) {
          setDisplayedContent(prev => prev + (prev ? '\n' : '') + lines[currentLine]);
          currentLine++;
        } else {
          clearInterval(interval);
          setShowThinking(false);
        }
      }, 500); // 500ms entre cada linha

      return () => clearInterval(interval);
    }
  }, [showThinking, realContent]);

  const handleExecuteCode = async (blockIndex: number, code: string) => {
    setExecutionStates(prev => ({
      ...prev,
      [blockIndex]: { ...prev[blockIndex], isExecuting: true, result: null }
    }));

    try {
      const result = await executePythonCode(code);
      setExecutionStates(prev => ({
        ...prev,
        [blockIndex]: { ...prev[blockIndex], isExecuting: false, result }
      }));
    } catch (error: any) {
      setExecutionStates(prev => ({
        ...prev,
        [blockIndex]: {
          ...prev[blockIndex],
          isExecuting: false,
          result: { output: '', error: error.message || 'Erro desconhecido' }
        }
      }));
    }
  };

  const handleEditCode = (blockIndex: number) => {
    if (!message.codeBlocks?.[blockIndex]) return;
    setEditingBlockIndex(blockIndex);
    setEditedCode(message.codeBlocks[blockIndex].code);
  };

  const handleSaveEdit = (blockIndex: number) => {
    if (!message.codeBlocks?.[blockIndex]) return;
    onCodeEdited(message.id, blockIndex, editedCode);
    setEditingBlockIndex(null);
  };

  const handleCancelEdit = () => {
    setEditingBlockIndex(null);
    setEditedCode('');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="flex flex-col gap-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-2 border rounded"
            rows={5}
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Salvar
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {showThinking && <ThinkingAnimation />}
        <div className="prose max-w-none whitespace-pre-wrap">
          {displayedContent}
        </div>
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {message.images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Imagem ${index + 1}`}
                className="max-w-full h-auto rounded-md"
              />
            ))}
          </div>
        )}
        {message.codeBlocks?.map((block, index) => (
          <div key={index} className="relative">
            <SyntaxHighlighter
              language={block.language}
              style={vscDarkPlus}
              className="rounded-lg"
            >
              {block.code}
            </SyntaxHighlighter>
            {pyodideStatus.pyodide && !pyodideStatus.isLoading && (
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleExecuteCode(index, block.code)}
                  className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  disabled={executionStates[index]?.isExecuting}
                >
                  {executionStates[index]?.isExecuting ? 'Executando...' : 'Executar'}
                </button>
                <button
                  onClick={() => handleEditCode(index)}
                  className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                >
                  Editar
                </button>
              </div>
            )}
            {editingBlockIndex === index && (
              <div className="mt-2">
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="w-full p-2 border rounded font-mono text-sm"
                  rows={5}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSaveEdit(index)}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Salvar
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
            {executionStates[index]?.result && (
              <div className="mt-2 p-2 bg-gray-800 rounded-lg">
                {executionStates[index].result.error ? (
                  <div className="text-red-500">{executionStates[index].result.error}</div>
                ) : (
                  <>
                    {executionStates[index].result.output && (
                      <div className="text-gray-200 whitespace-pre-wrap">
                        {executionStates[index].result.output}
                      </div>
                    )}
                    {executionStates[index].result.plot && (
                      <img
                        src={`data:image/png;base64,${executionStates[index].result.plot}`}
                        alt="Plot"
                        className="mt-2 max-w-full"
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {message.files?.map((file, index) => (
          <FileDownload key={index} file={file} />
        ))}
      </div>
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-800 text-gray-200'
        }`}
      >
        {renderContent()}
        {message.role === 'user' && onEdit && (
          <button
            onClick={handleEdit}
            className="mt-2 text-sm text-blue-200 hover:text-white"
          >
            Editar
          </button>
        )}
      </div>
    </div>
  );
}; 