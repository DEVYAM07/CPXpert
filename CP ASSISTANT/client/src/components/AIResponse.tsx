import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIResponseProps {
  response: string;
}

const AIResponse: React.FC<AIResponseProps> = ({ response }) => {
  // Custom renderer for code blocks
  const renderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : 'text';
      
      return !inline ? (
        <div className="rounded-md overflow-hidden my-4">
          <div className="bg-gray-800 px-4 py-2 text-xs font-mono flex items-center justify-between">
            <span>{language}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
              }}
              className="text-gray-400 hover:text-white transition-colors"
              title="Copy code"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <code className="bg-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
          {children}
        </code>
      );
    },
    table({ children }: any) {
      return (
        <div className="overflow-x-auto my-4">
          <table className="border-collapse border border-gray-700 w-full">
            {children}
          </table>
        </div>
      );
    },
    th({ children }: any) {
      return (
        <th className="border border-gray-700 px-4 py-2 bg-gray-800 text-left">
          {children}
        </th>
      );
    },
    td({ children }: any) {
      return (
        <td className="border border-gray-700 px-4 py-2">
          {children}
        </td>
      );
    },
  };
  
  return (
    <Card className="bg-darklight shadow-md overflow-hidden">
      <CardContent className="p-6">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown components={renderers}>
            {response}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIResponse;