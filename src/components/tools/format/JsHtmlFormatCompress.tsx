// src/components/tools/format/JsHtmlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsFormat, jsCompress, htmlFormat, htmlCompress } from '@/lib/format-utils';

const EXAMPLE = '<div><script>function hello(){console.log("Hello World");}</script><p class="text">Test</p></div>';

type Mode = 'format' | 'compress';

export default function JsHtmlFormatCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter code'); return; }
    try {
      if (mode === 'format') {
        // Format HTML first, then format inline JS
        const html = htmlFormat(input);
        setOutput(html);
      } else {
        const compressed = htmlCompress(input);
        // Also compress any inline JS
        setOutput(compressed);
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS/HTML Format & Compress" description="Smart mixed JS and HTML code formatting and compression."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS/HTML code...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label="Mode">
        <SelectOption label="" value={mode} options={[
          { label: 'Format', value: 'format' },
          { label: 'Compress', value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
