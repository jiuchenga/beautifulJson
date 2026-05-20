// src/components/tools/json/JsonCompressEscape.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { minifyJSON, escapeJSON, unescapeJSON } from '@/lib/json-utils';
import { useToolI18n } from '@/lib/react-i18n';

type Mode = 'compress' | 'escape' | 'unicode' | 'unescape';

const EXAMPLE = '{\n  "name": "Hello World",\n  "description": "A test string with \\"quotes\\" and\\nnewlines"\n}';

export default function JsonCompressEscape({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('compress');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try {
      switch (mode) {
        case 'compress':
          setOutput(minifyJSON(input));
          break;
        case 'escape':
          setOutput(escapeJSON(input));
          break;
        case 'unicode':
          setOutput(input.replace(/[^\x00-\x7F]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
          break;
        case 'unescape':
          setOutput(unescapeJSON(input));
          break;
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
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      options={
        <OptionBar label={t.mode}>
          <SelectOption
            label=""
            value={mode}
            options={[
              { label: t.compressMinify, value: 'compress' },
              { label: t.escape, value: 'escape' },
              { label: t.unicodeEncode, value: 'unicode' },
              { label: t.unescape, value: 'unescape' },
            ]}
            onChange={(v) => setMode(v as Mode)}
          />
        </OptionBar>
      }
    />
  );
}
