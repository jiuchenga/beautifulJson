// src/components/tools/format/JsFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsFormat, jsCompress } from '@/lib/format-utils';

const EXAMPLE = 'function add(a,b){return a+b;}const result=add(1,2);console.log(result);';

type Mode = 'format' | 'compress';

export default function JsFormatCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try { setOutput(mode === 'format' ? jsFormat(input) : jsCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Format & Compress" description="Beautify or compress JavaScript code."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS code...' }}
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
