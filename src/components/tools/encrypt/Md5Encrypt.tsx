// src/components/tools/encrypt/Md5Encrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { CheckboxOption } from '../shared/OptionBar';
import { hashText, md5Short } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'Hello, DevToolkit!';

export default function Md5Encrypt({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [short16, setShort16] = useState(false);

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterText); return; }
    try { setOutput(short16 ? md5Short(input) : hashText(input, 'MD5')); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ placeholder: t.phEnterText }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label={t.options}>
        <CheckboxOption label={t.sixteenBitShort} checked={short16} onChange={setShort16} />
      </OptionBar>}
    />
  );
}
