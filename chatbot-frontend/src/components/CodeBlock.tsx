import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between bg-gray-700/50 p-2 rounded-t">
        <span className="text-sm text-gray-300">{language}</span>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.375rem 0.375rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}; 