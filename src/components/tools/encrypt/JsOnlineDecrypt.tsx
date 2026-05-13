// src/components/tools/encrypt/JsOnlineDecrypt.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { jsDeobfuscateSimple, jsHexDecode } from '@/lib/crypto-utils';

const EXAMPLE = "eval(decodeURIComponent(escape(atob('YWxlcnQoIkhlbGxvISIpOw=='))));";

export default function JsOnlineDecrypt() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter encrypted JS'); return; }
    try {
      // Try multiple deobfuscation strategies
      let result = input;
      try { result = jsDeobfuscateSimple(result); } catch {}
      if (result.includes('\\x')) { try { result = jsHexDecode(result); } catch {} }
      setOutput(result);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell title="JS Online Decrypt" description="Automatic JavaScript de-obfuscation with multi-strategy support."
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      inputEditor={{ language: 'javascript', placeholder: 'Paste obfuscated JS...' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
    />
  );
}
