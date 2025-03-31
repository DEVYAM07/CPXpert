import React, { createContext, useContext, useState } from 'react';

interface CodeContextType {
  code: string;
  language: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  problemStatement: string;
  setProblemStatement: (statement: string) => void;
  clearAll: () => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [problemStatement, setProblemStatement] = useState('');
  
  const clearAll = () => {
    setCode('');
    setProblemStatement('');
  };
  
  return (
    <CodeContext.Provider
      value={{
        code,
        language,
        setCode,
        setLanguage,
        problemStatement,
        setProblemStatement,
        clearAll,
      }}
    >
      {children}
    </CodeContext.Provider>
  );
};

export const useCode = (): CodeContextType => {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};