// src/components/tools/encrypt/NumberBaseConverter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { convertBase, type NumberBase } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

const BASE_KEYS: Array<{ labelKey: string; value: string }> = [
  { labelKey: 'binary', value: 'binary' },
  { labelKey: 'octal', value: 'octal' },
  { labelKey: 'decimal', value: 'decimal' },
  { labelKey: 'hexBase', value: 'hex' },
  { labelKey: 'base32', value: 'base32' },
  { labelKey: 'base36', value: 'base36' },
];

export default function NumberBaseConverter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [fromBase, setFromBase] = useState<NumberBase>('decimal');
  const [toBase, setToBase] = useState<NumberBase>('hex');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterNumber); return; }
    try { setOutput(convertBase(input, fromBase, toBase)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang}
      title={toolTitle ?? ''}
      description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput('255')}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); const tb = toBase; setToBase(fromBase); setFromBase(tb); }}
      error={error}
      inputEditor={{ placeholder: t.pleaseEnterNumber }}
      outputEditor={{ readOnly: true }}
      options={<OptionBar label={t.convert}>
        <SelectOption label={t.from} value={fromBase} options={BASE_KEYS.map(b => ({ label: (t as any)[b.labelKey] || b.labelKey, value: b.value }))} onChange={(v) => setFromBase(v as NumberBase)} />
        <SelectOption label={t.to} value={toBase} options={BASE_KEYS.map(b => ({ label: (t as any)[b.labelKey] || b.labelKey, value: b.value }))} onChange={(v) => setToBase(v as NumberBase)} />
      </OptionBar>}
    />
  );
}
