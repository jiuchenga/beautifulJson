// src/components/tools/encrypt/ThunderUrlCodec.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { encodeThunderUrl, decodeThunderUrl } from '@/lib/crypto-utils';

export default function ThunderUrlCodec() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter a URL'); return; }
    try { setOutput(mode === 'encode' ? encodeThunderUrl(input) : decodeThunderUrl(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="Thunder URL Encrypt / Decrypt" description="Encode or decode Thunder (迅雷) download links."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encode' ? 'decode' : 'encode'); }}
      onExample={() => setInput(mode === 'encode' ? 'https://example.com/file.zip' : 'thunder://QUFodHRwczovL2V4YW1wbGUuY29tL2ZpbGUuemlwWlo=')}
      error={error}>
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Decode</button>
      </div>
    </ToolShell>
  );
}
