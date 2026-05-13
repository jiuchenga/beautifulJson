// src/components/tools/encrypt/NumberBaseConverter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { convertBase, type NumberBase } from '@/lib/crypto-utils';

const BASE_OPTIONS = [
  { label: 'Binary (2)', value: 'binary' },
  { label: 'Octal (8)', value: 'octal' },
  { label: 'Decimal (10)', value: 'decimal' },
  { label: 'Hex (16)', value: 'hex' },
  { label: 'Base32 (32)', value: 'base32' },
  { label: 'Base36 (36)', value: 'base36' },
];

export default function NumberBaseConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>('decimal');
  const [toBase, setToBase] = useState<NumberBase>('hex');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter a number'); return; }
    try { setOutput(convertBase(input, fromBase, toBase)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell
      title="Number Base Converter"
      description="Convert numbers between Binary, Octal, Decimal, Hex, Base32, Base36."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput('255')}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); const tb = toBase; setToBase(fromBase); setFromBase(tb); }}
      error={error}
      inputEditor={{ placeholder: 'Enter number...' }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label="Convert">
        <SelectOption label="From" value={fromBase} options={BASE_OPTIONS} onChange={(v) => setFromBase(v as NumberBase)} />
        <SelectOption label="To" value={toBase} options={BASE_OPTIONS} onChange={(v) => setToBase(v as NumberBase)} />
      </OptionBar>}
    />
  );
}
