// src/components/tools/format/JsObfuscateCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { CheckboxOption } from '../shared/OptionBar';
import { jsObfuscateSimple } from '@/lib/crypto-utils';
import { jsCompress } from '@/lib/format-utils';

const EXAMPLE = 'function calculatePrice(base, tax, discount) { return base * (1 + tax) - discount; }';

export default function JsObfuscateCompress() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [compressFirst, setCompressFirst] = useState(true);

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try {
      const code = compressFirst ? jsCompress(input) : input;
      setOutput(jsObfuscateSimple(code));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Obfuscate & Compress" description="Combine compression and obfuscation for JavaScript protection."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS code...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label="Options">
        <CheckboxOption label="Compress before obfuscation" checked={compressFirst} onChange={setCompressFirst} />
      </OptionBar>}
    />
  );
}
