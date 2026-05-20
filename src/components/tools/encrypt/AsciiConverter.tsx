// src/components/tools/encrypt/AsciiConverter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { textToAscii, asciiToText } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

export default function AsciiConverter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'text2ascii' | 'ascii2text'>('text2ascii');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try { setOutput(mode === 'text2ascii' ? textToAscii(input) : asciiToText(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'text2ascii' ? 'ascii2text' : 'text2ascii'); }}
      onExample={() => setInput(mode === 'text2ascii' ? 'Hello' : '72 101 108 108 111')}
      error={error}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('text2ascii')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'text2ascii' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.textToAscii}</button>
        <button onClick={() => setMode('ascii2text')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'ascii2text' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.asciiToText}</button>
      </div>}
    />
  );
}
