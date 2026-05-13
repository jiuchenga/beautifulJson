// src/components/tools/format/JsObfuscateEncrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsObfuscateSimple, jsHexEncode } from '@/lib/crypto-utils';
import { jsCompress } from '@/lib/format-utils';

const EXAMPLE = 'function validate(input) { if (input.length > 10) { return true; } return false; }';

type Mode = 'obfuscate' | 'hex' | 'compress-obfuscate';

export default function JsObfuscateEncrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('obfuscate');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JS code'); return; }
    try {
      switch (mode) {
        case 'obfuscate': setOutput(jsObfuscateSimple(input)); break;
        case 'hex': setOutput(jsHexEncode(input)); break;
        case 'compress-obfuscate': setOutput(jsObfuscateSimple(jsCompress(input))); break;
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Code Obfuscate & Encrypt" description="Obfuscate and encrypt JavaScript code with multiple strategies."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste JS code...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={<OptionBar label="Method">
        <SelectOption label="" value={mode} options={[
          { label: 'Base64 Eval Wrap', value: 'obfuscate' },
          { label: 'Hex Escape', value: 'hex' },
          { label: 'Compress + Obfuscate', value: 'compress-obfuscate' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
