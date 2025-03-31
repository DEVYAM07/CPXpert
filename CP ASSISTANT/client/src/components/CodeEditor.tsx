import React from 'react';
import Editor from '@monaco-editor/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
  setLanguage: (language: string) => void;
  height?: string;
}

const LANGUAGE_OPTIONS = [
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' }
];

const CodeEditor: React.FC<CodeEditorProps> = ({
  language,
  value,
  onChange,
  setLanguage,
  height = '400px'
}) => {
  const getMonacoLanguage = (lang: string): string => {
    // Map our language values to Monaco's expected values
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'python': return 'python';
      case 'java': return 'java';
      case 'javascript': return 'javascript';
      case 'typescript': return 'typescript';
      case 'csharp': return 'csharp';
      case 'go': return 'go';
      case 'rust': return 'rust';
      case 'kotlin': return 'kotlin';
      default: return 'cpp';
    }
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-2">
        <div className="w-40">
          <Select
            value={language}
            onValueChange={setLanguage}
          >
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGE_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Editor
          height={height}
          language={getMonacoLanguage(language)}
          value={value}
          onChange={value => onChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontFamily: 'JetBrains Mono, Fira Code, monospace',
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;