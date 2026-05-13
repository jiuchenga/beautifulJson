// src/components/tools/encrypt/Utf8Encoder.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { textToUtf8Codes, utf8CodesToText } from '@/lib/crypto-utils';

export default function Utf8Encoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter content'); return; }
    try { setOutput(mode === 'encode' ? textToUtf8Codes(input) : utf8CodesToText(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="UTF-8 Encoder" description="Convert text to UTF-8 byte codes and back."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encode' ? 'decode' : 'encode'); }}
      onExample={() => setInput('你好 Hello')}
      error={error}>
      <div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>Decode</button>
      </div>
    </ToolShell>
  );
}
