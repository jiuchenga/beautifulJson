// src/components/tools/encrypt/JsHexEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsHexEncode, jsHexDecode } from '@/lib/crypto-utils';

const EXAMPLE = 'alert("Hello!");';

export default function JsHexEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter content'); return; }
    try { setOutput(mode === 'encode' ? jsHexEncode(input) : jsHexDecode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Encrypt (Hex)" description="Encode JavaScript code to hexadecimal escape sequences."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encode' ? 'decode' : 'encode'); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript' }}
      outputEditor={{ language: 'javascript', readOnly: true }}>
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Hex Encode</button>
        <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Hex Decode</button>
      </div>
    </ToolShell>
  );
}
