// src/components/tools/encrypt/JsManualDecrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsDeobfuscateSimple } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = "eval(decodeURIComponent(escape(atob('ZnVuY3Rpb24gaGVsbG8oKSB7IGNvbnNvbGUubG9nKCJIZWxsbyIpOyB9'))));";

export default function JsManualDecrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterEncrypted); return; }
    try { setOutput(jsDeobfuscateSimple(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: t.pleaseEnterEncrypted }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
