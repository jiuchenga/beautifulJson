// src/components/tools/json/JsonFormatOnline.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { formatJSON, validateJSON } from '@/lib/json-utils';

const EXAMPLE = '{"products":[{"id":1,"name":"Laptop","price":999.99,"inStock":true},{"id":2,"name":"Mouse","price":29.99,"inStock":false}],"total":2}';

export default function JsonFormatOnline() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [validation, setValidation] = useState<{ valid: boolean; error?: string } | null>(null);

  function handleExecute() {
    setError('');
    setValidation(null);
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const result = validateJSON(input);
    setValidation(result);
    if (result.valid) {
      try {
        setOutput(formatJSON(input, 2, false));
      } catch (e) {
        setError((e as Error).message);
      }
    } else {
      setError(result.error || 'Invalid JSON');
    }
  }

  return (
    <ToolShell
      title="JSON Format Online"
      description="Online JSON formatting and validation tool."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); setValidation(null); }}
      onExample={() => setInput(EXAMPLE)}
      onDownload={() => {
        const blob = new Blob([output], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'formatted.json';
        a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
    >
      {validation?.valid && (
        <div className="mt-4 rounded-lg border border-[var(--accent-green)]/30 bg-[var(--accent-green)]/10 px-4 py-2 text-sm text-[var(--accent-green)]">
          ✓ Valid JSON
        </div>
      )}
    </ToolShell>
  );
}
