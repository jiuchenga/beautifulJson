// src/components/tools/encrypt/Base64Codec.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { base64Encode, base64Decode } from '@/lib/crypto-utils';

const EXAMPLE = 'Hello, DevToolkit!';

export default function Base64Codec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter content'); return; }
    try {
      setOutput(mode === 'encode' ? base64Encode(input) : base64Decode(input));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell
      title="Base64 Encode / Decode"
      description="Encode text to Base64 or decode Base64 to text."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encode' ? 'decode' : 'encode'); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ placeholder: mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...' }}
    >
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Decode</button>
      </div>
    </ToolShell>
  );
}
