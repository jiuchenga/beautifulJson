// src/components/tools/encrypt/JsAAEncode.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsAAEncode } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'console.log("Hello")';

export default function JsAAEncode({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJs); return; }
    try { setOutput(jsAAEncode(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
