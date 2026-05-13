// src/components/tools/encrypt/JsObfuscation.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsObfuscateSimple, jsDeobfuscateSimple } from '@/lib/crypto-utils';

const EXAMPLE = 'function greet(name) { return "Hello, " + name + "!"; }';

export default function JsObfuscation() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try { setOutput(jsObfuscateSimple(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Code Obfuscation" description="Obfuscate JavaScript code with base64 eval wrapping."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS code to obfuscate...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
