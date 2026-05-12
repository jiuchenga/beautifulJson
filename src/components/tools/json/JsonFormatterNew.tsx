// src/components/tools/json/JsonFormatterNew.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { CheckboxOption } from '../shared/OptionBar';
import { formatJSON, validateJSON, analyzeJSONTypes } from '@/lib/json-utils';

const EXAMPLE = '[\n  {"id": 1, "name": "Alice", "active": true, "score": 95.5},\n  {"id": 2, "name": "Bob", "active": false, "score": 87.3}\n]';

export default function JsonFormatterNew() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [typeInfo, setTypeInfo] = useState('');
  const [error, setError] = useState('');
  const [showTypes, setShowTypes] = useState(true);
  const [showIndex, setShowIndex] = useState(true);

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JSON'); return; }
    const validation = validateJSON(input);
    if (!validation.valid) { setError(validation.error || 'Invalid JSON'); return; }
    try {
      const formatted = formatJSON(input, 2, false);
      setOutput(formatted);
      if (showTypes) {
        setTypeInfo(analyzeJSONTypes(input));
      } else {
        setTypeInfo('');
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ToolShell
      title="JSON Formatter (Enhanced)"
      description="Enhanced JSON formatter with data type display, array index, and syntax highlighting."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setTypeInfo(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      options={
        <OptionBar label="Options">
          <CheckboxOption label="Show Types" checked={showTypes} onChange={setShowTypes} />
          <CheckboxOption label="Show Array Index" checked={showIndex} onChange={setShowIndex} />
        </OptionBar>
      }
    >
      {typeInfo && (
        <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--accent-blue)]">Type Analysis</h3>
          <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">{typeInfo}</pre>
        </div>
      )}
    </ToolShell>
  );
}
