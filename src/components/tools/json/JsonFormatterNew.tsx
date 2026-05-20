// src/components/tools/json/JsonFormatterNew.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { CheckboxOption } from '../shared/OptionBar';
import { formatJSON, validateJSON, analyzeJSONTypes } from '@/lib/json-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '[\n  {"id": 1, "name": "Alice", "active": true, "score": 95.5},\n  {"id": 2, "name": "Bob", "active": false, "score": 87.3}\n]';

export default function JsonFormatterNew({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [typeInfo, setTypeInfo] = useState('');
  const [error, setError] = useState('');
  const [showTypes, setShowTypes] = useState(true);
  const [showIndex, setShowIndex] = useState(true);

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJson); return; }
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
    <ToolShell lang={lang}
      title={toolTitle ?? ''}
      description={toolDesc ?? ''}
      inputValue={input}
      onInputChange={setInput}
      outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setTypeInfo(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      error={error}
      options={
        <OptionBar label={t.options}>
          <CheckboxOption label={t.showTypes} checked={showTypes} onChange={setShowTypes} />
          <CheckboxOption label={t.showIndex} checked={showIndex} onChange={setShowIndex} />
        </OptionBar>
      }
    >
      {typeInfo && (
        <div className="mt-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-semibold text-[var(--accent-blue)]">{t.typeAnalysis}</h3>
          <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">{typeInfo}</pre>
        </div>
      )}
    </ToolShell>
  );
}
