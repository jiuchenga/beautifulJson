// src/components/tools/format/CssFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { cssFormat, cssCompress } from '@/lib/format-utils';

const EXAMPLE = 'body{margin:0;padding:0;font-family:sans-serif}.container{max-width:1200px;margin:0 auto;padding:0 1rem}.btn{display:inline-block;padding:0.5rem 1rem;border-radius:0.25rem;background:#3b82f6;color:#fff;text-decoration:none}';

type Mode = 'format' | 'compress';

export default function CssFormatCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter CSS code'); return; }
    try { setOutput(mode === 'format' ? cssFormat(input) : cssCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="CSS Format & Compress" description="Beautify or compress CSS code."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste CSS code...' }}
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
