// src/components/tools/encrypt/JsIrreversible.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsObfuscateSimple } from '@/lib/crypto-utils';

const EXAMPLE = 'var secret = "password123";';

export default function JsIrreversible() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try {
      // Double-layer obfuscation
      const first = jsObfuscateSimple(input);
      setOutput(jsObfuscateSimple(first));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Irreversible Encryption" description="Multi-layer JavaScript obfuscation encryption."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
