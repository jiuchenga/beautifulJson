// src/components/tools/json/JsonFormatter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption, CheckboxOption } from '../shared/OptionBar';
import { formatJSON, validateJSON } from '@/lib/json-utils';

const EXAMPLE = '{\n  "name": "DevToolkit",\n  "version": "1.0",\n  "tools": ["JSON", "Encrypt", "QR"],\n  "config": {\n    "dark": true,\n    "lang": "en"\n  }\n}';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);

  function handleExecute() {
    setError('');
    if (!input.trim()) {
      setError('Please enter JSON');
      return;
    }
    const validation = validateJSON(input);
    if (!validation.valid) {
      setError(validation.error || 'Invalid JSON');
      return;
    }
    try {
      setOutput(formatJSON(input, indent, sortKeys));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function handleClear() {
    setInput('');
    setOutput('');
    setError('');
  }

  return (
    <ToolShell
      title="JSON Formatter"
      description="Format, validate and beautify JSON with syntax highlighting and error detection."
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={handleClear}
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
      options={
        <OptionBar label="Options">
          <SelectOption
            label="Indent"
            value={indent}
            options={[
              { label: '2 spaces', value: 2 },
              { label: '4 spaces', value: 4 },
              { label: 'Tab', value: 'tab' },
            ]}
            onChange={(v) => setIndent(v === 'tab' ? 0 : parseInt(v))}
          />
          <CheckboxOption label="Sort Keys" checked={sortKeys} onChange={setSortKeys} />
        </OptionBar>
      }
    />
  );
}
