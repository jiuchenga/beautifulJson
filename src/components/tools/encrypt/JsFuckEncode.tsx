// src/components/tools/encrypt/JsFuckEncode.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsFuckEncode } from '@/lib/crypto-utils';

const EXAMPLE = 'alert(1)';

export default function JsFuckEncode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try { setOutput(jsFuckEncode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JSFuck Encrypt" description="Encode JavaScript using only []()!+ characters."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Enter short JS expression...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
