// src/components/tools/encrypt/HexTextConverter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { textToHex, hexToText } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

export default function HexTextConverter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'text2hex' | 'hex2text'>('text2hex');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try { setOutput(mode === 'text2hex' ? textToHex(input) : hexToText(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'text2hex' ? 'hex2text' : 'text2hex'); }}
      onExample={() => setInput(mode === 'text2hex' ? 'Hello' : '48 65 6c 6c 6f')}
      error={error}
      inputEditor={{ placeholder: mode === 'text2hex' ? t.phEnterText : t.phEnterText }}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('text2hex')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'text2hex' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.textToHex}</button>
        <button onClick={() => setMode('hex2text')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'hex2text' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.hexToText}</button>
      </div>}
    />
  );
}
