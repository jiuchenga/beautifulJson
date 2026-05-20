// src/components/tools/encrypt/JsObfuscation.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsObfuscateSimple, jsDeobfuscateSimple } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'function greet(name) { return "Hello, " + name + "!"; }';

export default function JsObfuscation({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJs); return; }
    try { setOutput(jsObfuscateSimple(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: t.pleaseEnterJs }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
