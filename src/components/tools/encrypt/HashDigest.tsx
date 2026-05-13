// src/components/tools/encrypt/HashDigest.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { hashText, type HashAlgorithm } from '@/lib/crypto-utils';

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

export default function HashDigest() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA256');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter text'); return; }
    try { setOutput(hashText(input, algorithm)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell
      title="Hash / Digest"
      description="Generate hash digests with MD5, SHA-1, SHA-256, SHA-512, SHA-3, RIPEMD-160."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ placeholder: 'Enter text to hash...' }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label="Algorithm"><SelectOption label="" value={algorithm} options={ALGORITHMS} onChange={(v) => setAlgorithm(v as HashAlgorithm)} /></OptionBar>}
    />
  );
}
