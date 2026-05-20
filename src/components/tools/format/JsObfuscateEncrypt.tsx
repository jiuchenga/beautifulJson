// src/components/tools/format/JsObfuscateEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsObfuscateSimple, jsHexEncode } from '@/lib/crypto-utils';
import { jsCompress } from '@/lib/format-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'function validate(input) { if (input.length > 10) { return true; } return false; }';

type Mode = 'obfuscate' | 'hex' | 'compress-obfuscate';

export default function JsObfuscateEncrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('obfuscate');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJs); return; }
    try {
      switch (mode) {
        case 'obfuscate': setOutput(jsObfuscateSimple(input)); break;
        case 'hex': setOutput(jsHexEncode(input)); break;
        case 'compress-obfuscate': setOutput(jsObfuscateSimple(jsCompress(input))); break;
      }
    } catch (e) { setError((e as Error).message); }
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
      options={<OptionBar label={t.method}>
        <SelectOption label="" value={mode} options={[
          { label: t.base64EvalWrap, value: 'obfuscate' },
          { label: t.hexEscapeMode, value: 'hex' },
          { label: t.compressObfuscate, value: 'compress-obfuscate' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
