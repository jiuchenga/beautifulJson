// src/components/tools/encode/HtmlEscape.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { htmlEscape, htmlUnescape } from '@/lib/convert-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '<div class="hello">&copy; 2024 "DevToolkit"</div>';

export default function HtmlEscape({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try { setOutput(mode === 'escape' ? htmlEscape(input) : htmlUnescape(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'escape' ? 'unescape' : 'escape'); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'html', placeholder: mode === 'escape' ? 'Enter HTML to escape...' : 'Enter escaped HTML...' }}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('escape')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'escape' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.escape}</button>
        <button onClick={() => setMode('unescape')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'unescape' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.unescape}</button>
      </div>}
    />
  );
}
