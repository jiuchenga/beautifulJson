// src/components/tools/encrypt/AesEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { symmetricEncrypt, symmetricDecrypt, type SymmetricAlgorithm } from '@/lib/crypto-utils';

const EXAMPLE = 'Hello, DevToolkit!';

const ALGORITHMS = [
  { label: 'AES', value: 'AES' },
  { label: 'DES', value: 'DES' },
  { label: 'TripleDES', value: 'TripleDES' },
  { label: 'RC4', value: 'RC4' },
  { label: 'Rabbit', value: 'Rabbit' },
  { label: 'PBKDF2', value: 'PBKDF2' },
];

export default function AesEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [algorithm, setAlgorithm] = useState<SymmetricAlgorithm>('AES');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter text'); return; }
    if (!key.trim()) { setError('Please enter a key'); return; }
    try {
      if (mode === 'encrypt') {
        setOutput(symmetricEncrypt(input, key, algorithm));
      } else {
        const result = symmetricDecrypt(input, key, algorithm);
        if (!result) throw new Error('Decryption failed. Check key and ciphertext.');
        setOutput(result);
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ToolShell
      title="Encrypt / Decrypt"
      description="Symmetric encryption and decryption with AES, DES, TripleDES, RC4, Rabbit, PBKDF2."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt'); }}
      onDownload={() => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'encrypted.txt'; a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
      options={
        <OptionBar label="Options">
          <SelectOption label="Mode" value={mode} options={[
            { label: 'Encrypt', value: 'encrypt' },
            { label: 'Decrypt', value: 'decrypt' },
          ]} onChange={(v) => setMode(v as 'encrypt' | 'decrypt')} />
          <SelectOption label="Algorithm" value={algorithm} options={ALGORITHMS} onChange={(v) => setAlgorithm(v as SymmetricAlgorithm)} />
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            Key
            <input type="text" value={key} onChange={(e) => setKey(e.target.value)}
              className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] w-40"
              placeholder="Enter key..." />
          </label>
        </OptionBar>
      }
    />
  );
}
