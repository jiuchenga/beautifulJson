// src/components/tools/encrypt/JsAAEncode.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsAAEncode } from '@/lib/crypto-utils';

const EXAMPLE = 'console.log("Hello")';

export default function JsAAEncode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try { setOutput(jsAAEncode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS AAEncode Encrypt" description="Encode JavaScript with anime emoticon characters."
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
