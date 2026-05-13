// src/components/tools/encrypt/JsCompressEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsObfuscateSimple, jsDeobfuscateSimple } from '@/lib/crypto-utils';

const EXAMPLE = 'function hello() { console.log("Hello World"); }';

type Mode = 'encrypt' | 'decrypt' | 'compress';

export default function JsCompressEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('encrypt');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try {
      if (mode === 'encrypt') setOutput(jsObfuscateSimple(input));
      else if (mode === 'decrypt') setOutput(jsDeobfuscateSimple(input));
      else setOutput(input.replace(/\s+/g, ' ').replace(/;\s*/g, ';').replace(/\{\s*/g, '{').replace(/\}\s*/g, '}'));
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Encrypt / Compress / Decrypt" description="Encrypt, compress, or decrypt JavaScript code."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS code here...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label="Mode">
        <SelectOption label="" value={mode} options={[
          { label: 'Encrypt', value: 'encrypt' },
          { label: 'Decrypt', value: 'decrypt' },
          { label: 'Compress', value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
