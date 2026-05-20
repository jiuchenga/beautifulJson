// src/components/tools/encrypt/JsCompressEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsObfuscateSimple, jsDeobfuscateSimple } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'function hello() { console.log("Hello World"); }';

type Mode = 'encrypt' | 'decrypt' | 'compress';

export default function JsCompressEncrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('encrypt');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJs); return; }
    try {
      if (mode === 'encrypt') setOutput(jsObfuscateSimple(input));
      else if (mode === 'decrypt') setOutput(jsDeobfuscateSimple(input));
      else setOutput(input.replace(/\s+/g, ' ').replace(/;\s*/g, ';').replace(/\{\s*/g, '{').replace(/\}\s*/g, '}'));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: t.pleaseEnterJs }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label={t.mode}>
        <SelectOption label="" value={mode} options={[
          { label: t.encrypt, value: 'encrypt' },
          { label: t.decrypt, value: 'decrypt' },
          { label: t.compress, value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
