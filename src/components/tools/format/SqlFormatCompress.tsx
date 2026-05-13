// src/components/tools/format/SqlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { sqlFormatCode, sqlCompress } from '@/lib/format-utils';

const EXAMPLE = 'SELECT u.id, u.name, u.email FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.active = 1 AND o.total > 100 ORDER BY u.name ASC LIMIT 50';

type Mode = 'format' | 'compress';

export default function SqlFormatCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter SQL code'); return; }
    try { setOutput(mode === 'format' ? sqlFormatCode(input) : sqlCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="SQL Format & Compress" description="Beautify or compress SQL queries."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste SQL query...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label="Mode">
        <SelectOption label="" value={mode} options={[
          { label: 'Format (Beautify)', value: 'format' },
          { label: 'Compress (Minify)', value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
