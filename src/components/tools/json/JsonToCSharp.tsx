// src/components/tools/json/JsonToCSharp.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar from '../shared/OptionBar';
import { jsonToCSharp } from '@/lib/json-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '{"id": 1, "name": "Alice", "isActive": true, "balance": 1250.50, "tags": ["admin", "user"]}';

export default function JsonToCSharp({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [className, setClassName] = useState('Root');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterJson); return; }
    try {
      setOutput(jsonToCSharp(input, className));
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
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onDownload={() => {
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${className}.cs`;
        a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
      inputEditor={{ language: 'json' }}
      outputEditor={{ language: 'javascript', readOnly: true }}
      options={
        <OptionBar label={t.options}>
          <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            {t.className}
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
