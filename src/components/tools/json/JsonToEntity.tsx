// src/components/tools/json/JsonToEntity.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar from '../shared/OptionBar';
import { jsonToJavaEntity } from '@/lib/json-utils';

const EXAMPLE = '{"id": 1, "name": "Alice", "email": "alice@example.com", "active": true, "scores": [95, 87, 92], "address": {"city": "NYC", "zip": "10001"}}';

export default function JsonToEntity() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [className, setClassName] = useState('Root');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError('Please enter JSON'); return; }
    try {
      setOutput(jsonToJavaEntity(input, className));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <ToolShell
      title="JSON to Java Entity"
      description="Generate Java POJO/DTO/BO/VO classes from JSON data."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onDownload={() => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${className}.java`;
        a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
      inputEditor={{ language: 'json' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={
        <OptionBar label="Options">
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            Class Name
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] w-32"
            />
          </label>
        </OptionBar>
      }
    />
  );
}
