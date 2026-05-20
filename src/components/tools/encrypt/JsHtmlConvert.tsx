// src/components/tools/encrypt/JsHtmlConvert.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE_JS = 'document.getElementById("demo").innerHTML = "Hello";';
const EXAMPLE_HTML = '<script>document.getElementById("demo").innerHTML = "Hello";</script>';

export default function JsHtmlConvert({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'js2html' | 'html2js'>('js2html');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterCode); return; }
    try {
      if (mode === 'js2html') {
        setOutput(`<script>\n${input}\n</script>`);
      } else {
        const match = input.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
        setOutput(match ? match[1].trim() : input.replace(/<\/?script[^>]*>/gi, '').trim());
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'js2html' ? 'html2js' : 'js2html'); }}
      onExample={() => setInput(mode === 'js2html' ? EXAMPLE_JS : EXAMPLE_HTML)}
      error={error}
      inputEditor={{ language: 'javascript' }}
      outputEditor={{ language: 'html', readOnly: true }}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('js2html')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'js2html' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.jsToHtml}</button>
        <button onClick={() => setMode('html2js')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'html2js' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.htmlToJs}</button>
      </div>}
    />
  );
}
