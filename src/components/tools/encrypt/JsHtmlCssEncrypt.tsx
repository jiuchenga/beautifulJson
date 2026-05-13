// src/components/tools/encrypt/JsHtmlCssEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';

const EXAMPLE = '<div onclick="alert(1)">Hello</div>';

export default function JsHtmlCssEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter HTML/JS/CSS code'); return; }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      const nums = Array.from(encoded).map((c) => c.charCodeAt(0)).join(',');
      setOutput(`document.write(decodeURIComponent(escape(atob(String.fromCharCode(${nums}).toString()))));`);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS/HTML/CSS Mixed Encrypt" description="Numeric mixed encryption for JS, HTML, and CSS."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste HTML/JS/CSS code...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
