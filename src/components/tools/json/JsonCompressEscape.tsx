// src/components/tools/json/JsonCompressEscape.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { minifyJSON, escapeJSON, unescapeJSON } from '@/lib/json-utils';

type Mode = 'compress' | 'escape' | 'unicode' | 'unescape';

const EXAMPLE = '{\n  "name": "Hello World",\n  "description": "A test string with \\"quotes\\" and\\nnewlines"\n}';

export default function JsonCompressEscape() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('compress');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter content'); return; }
    try {
      switch (mode) {
        case 'compress':
          setOutput(minifyJSON(input));
          break;
        case 'escape':
          setOutput(escapeJSON(input));
          break;
        case 'unicode':
          setOutput(input.replace(/[^\x00-\x7F]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
          break;
        case 'unescape':
          setOutput(unescapeJSON(input));
          break;
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ToolShell
      title="JSON Compress / Escape"
      description="Compress, escape, or Unicode encode your JSON strings."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      options={
        <OptionBar label="Mode">
          <SelectOption
            label=""
            value={mode}
            options={[
              { label: 'Compress (Minify)', value: 'compress' },
              { label: 'Escape', value: 'escape' },
              { label: 'Unicode Encode', value: 'unicode' },
              { label: 'Unescape', value: 'unescape' },
            ]}
            onChange={(v) => setMode(v as Mode)}
          />
        </OptionBar>
      }
    />
  );
}
