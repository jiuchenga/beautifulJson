// src/components/tools/encrypt/JsManualDecrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsDeobfuscateSimple } from '@/lib/crypto-utils';

const EXAMPLE = "eval(decodeURIComponent(escape(atob('ZnVuY3Rpb24gaGVsbG8oKSB7IGNvbnNvbGUubG9nKCJIZWxsbyIpOyB9'))));";

export default function JsManualDecrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter encrypted JS'); return; }
    try { setOutput(jsDeobfuscateSimple(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Manual Decryption" description="Manually deobfuscate encrypted JavaScript code."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste encrypted JS...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
