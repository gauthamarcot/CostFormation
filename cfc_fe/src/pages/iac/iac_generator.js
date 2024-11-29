import React, { useState } from "react";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";

EditorContainer = styled.div`
  padding: 2rem;
`;

const CodeEditor = styled.textarea`
  width: 100%;
  height: 400px;
  font-family: monospace;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  white-space: pre-wrap; // Preserve line breaks and spaces
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
`;

const CodePage = ({ code }) => {
  const [editedCode, setEditedCode] = useState(code);

  const handleCodeChange = (event) => {
    setEditedCode(event.target.value);
  };

  return (
    <EditorContainer>
      <h2>Generated Code</h2>
      <CodeEditor value={editedCode} onChange={handleCodeChange} />
      <CopyToClipboard text={editedCode}>
        <Button>Copy Code</Button>
      </CopyToClipboard>
    </EditorContainer>
  );
};

export default CodePage;