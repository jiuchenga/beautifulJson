// src/components/tools/encrypt/HashDigest.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { hashText, type HashAlgorithm } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'Hello, DevToolkit!';

const ALGORITHMS: Array<{ label: string; value: HashAlgorithm }> = [
  { label: 'MD5', value: 'MD5' },
  { label: 'SHA-1', value: 'SHA1' },
  { label: 'SHA-224', value: 'SHA224' },
  { label: 'SHA-256', value: 'SHA256' },
  { label: 'SHA-512', value: 'SHA512' },
  { label: 'SHA-3', value: 'SHA3' },
  { label: 'RIPEMD-160', value: 'RIPEMD160' },
];

export default function HashDigest({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA256');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterText); return; }
    try { setOutput(hashText(input, algorithm)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang}
      title={toolTitle ?? ''}
      description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ placeholder: t.phEnterText }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label={t.algorithm}><SelectOption label="" value={algorithm} options={ALGORITHMS} onChange={(v) => setAlgorithm(v as HashAlgorithm)} /></OptionBar>}
    />
  );
}
