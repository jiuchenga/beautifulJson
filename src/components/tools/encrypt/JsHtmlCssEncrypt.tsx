// src/components/tools/encrypt/JsHtmlCssEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '<div onclick="alert(1)">Hello</div>';

export default function JsHtmlCssEncrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterHtml); return; }
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      const nums = Array.from(encoded).map((c) => c.charCodeAt(0)).join(',');
      setOutput(`document.write(decodeURIComponent(escape(atob(String.fromCharCode(${nums}).toString()))));`);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'html', placeholder: t.pleaseEnterHtml }}
      outputEditor={{ language: 'html', readOnly: true }}
    />
  );
}
