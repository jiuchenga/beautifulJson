// src/components/tools/encrypt/JsAdvancedEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsHexEncode, jsObfuscateSimple } from '@/lib/crypto-utils';

const EXAMPLE = 'function add(a, b) { return a + b; }';

export default function JsAdvancedEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try {
      const hexed = jsHexEncode(input);
      setOutput(jsObfuscateSimple(`eval("${hexed.replace(/"/g, '\\"')}");`));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Encrypt (Advanced)" description="Advanced mixed encryption combining hex encoding and obfuscation."
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
