// src/components/tools/encrypt/JsJJEncode.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsJJEncode } from '@/lib/crypto-utils';

const EXAMPLE = 'alert("test")';

export default function JsJJEncode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try { setOutput(jsJJEncode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS JJEncode Encrypt" description="Encode JavaScript with JJEncode pattern (irreversible)."
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
