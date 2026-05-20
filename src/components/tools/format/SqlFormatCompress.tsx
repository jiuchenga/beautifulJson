// src/components/tools/format/SqlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { sqlFormatCode, sqlCompress } from '@/lib/format-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = 'SELECT u.id, u.name, u.email FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 AND o.total > 100 ORDER BY u.name ASC LIMIT 50';

type Mode = 'format' | 'compress';

export default function SqlFormatCompress({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterSql); return; }
    try { setOutput(mode === 'format' ? sqlFormatCode(input) : sqlCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'sql', placeholder: t.pleaseEnterSql }}
      outputEditor={{ language: 'sql', readOnly: true }}
      options={<OptionBar label={t.mode}>
        <SelectOption label="" value={mode} options={[
          { label: t.formatBeautify, value: 'format' },
          { label: t.compressMinify, value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
