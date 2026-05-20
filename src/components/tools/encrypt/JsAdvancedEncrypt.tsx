// src/components/tools/encrypt/JsAdvancedEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsHexEncode, jsObfuscateSimple } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'function add(a, b) { return a + b; }';

export default function JsAdvancedEncrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJs); return; }
    try {
      const hexed = jsHexEncode(input);
      setOutput(jsObfuscateSimple(`eval("${hexed.replace(/"/g, '\\"')}");`));
    } catch (e) { setError((e as Error).message); }
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
