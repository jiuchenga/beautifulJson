// src/components/tools/encrypt/UrlCodec.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { urlEncode, urlDecode } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

export default function UrlCodec({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterUrl); return; }
    try { setOutput(mode === 'encode' ? urlEncode(input) : urlDecode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encode' ? 'decode' : 'encode'); }}
      onExample={() => setInput('https://example.com/path?q=hello world&lang=中文')}
      error={error}
      inputEditor={{ placeholder: mode === 'encode' ? t.phEnterUrl : t.phEnterUrl }}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('encode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'encode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.encode}</button>
        <button onClick={() => setMode('decode')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'decode' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.decode}</button>
      </div>}
    />
  );
}
