// src/components/tools/format/XmlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { xmlFormat, xmlCompress } from '@/lib/format-utils';

const EXAMPLE = '<root><item id="1"><name>Test</name><value>123</value></item><item id="2"><name>Demo</name><value>456</value></item></root>';

type Mode = 'format' | 'compress';

export default function XmlFormatCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter XML code'); return; }
    try { setOutput(mode === 'format' ? xmlFormat(input) : xmlCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="XML Format & Compress" description="Beautify or compress XML data."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste XML code...' }}
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
