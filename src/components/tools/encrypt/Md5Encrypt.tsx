// src/components/tools/encrypt/Md5Encrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { CheckboxOption } from '../shared/OptionBar';
import { hashText, md5Short } from '@/lib/crypto-utils';

const EXAMPLE = 'Hello, DevToolkit!';

export default function Md5Encrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [short16, setShort16] = useState(false);

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter text'); return; }
    try { setOutput(short16 ? md5Short(input) : hashText(input, 'MD5')); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="MD5 Encrypt / Decrypt" description="Generate MD5 hash (32-bit or 16-bit)."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ placeholder: 'Enter text to hash...' }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label="Options">
        <CheckboxOption label="16-bit (short)" checked={short16} onChange={setShort16} />
      </OptionBar>}
    />
  );
}
