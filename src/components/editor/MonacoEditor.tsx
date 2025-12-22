// src/components/editor/MonacoEditor.tsx
import Editor from "@monaco-editor/react";
import { setupMonaco } from "./MonacoSetup";

export interface MonacoEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
}

export const MonacoEditor = ({ value, language, onChange }: MonacoEditorProps) => {
  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      theme="vs-dark"
      beforeMount={() => setupMonaco()}
      onChange={(v) => onChange(v ?? "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        automaticLayout: true,
        scrollBeyondLastLine: false,
        wordWrap: "on",
      }}
    />
  );
};
