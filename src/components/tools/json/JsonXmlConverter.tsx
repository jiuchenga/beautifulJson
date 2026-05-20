// src/components/tools/json/JsonXmlConverter.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { jsonToXML, xmlToJSON } from '@/lib/json-utils';
import { useToolI18n } from '@/lib/react-i18n';

const JSON_EXAMPLE = '{"book": {"title": "Developer Guide", "author": "DevToolkit", "chapters": ["Intro", "Setup", "Advanced"]}}';
const XML_EXAMPLE = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <name>DevToolkit</name>\n  <version>1.0</version>\n</root>';

type Direction = 'json2xml' | 'xml2json';

export default function JsonXmlConverter({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [direction, setDirection] = useState<Direction>('json2xml');
  const [rootName, setRootName] = useState('root');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try {
      if (direction === 'json2xml') {
        setOutput(jsonToXML(input, rootName));
      } else {
        setOutput(xmlToJSON(input));
      }
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function handleSwap() {
    const tmp = input;
    setInput(output);
    setOutput(tmp);
    setDirection(direction === 'json2xml' ? 'xml2json' : 'json2xml');
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
      onSwap={handleSwap}
      onExample={() => setInput(direction === 'json2xml' ? JSON_EXAMPLE : XML_EXAMPLE)}
      onDownload={() => {
        const ext = direction === 'json2xml' ? 'xml' : 'json';
        const blob = new Blob([output], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
      }}
      error={error}
      inputEditor={{ language: direction === 'json2xml' ? 'json' : 'xml', placeholder: direction === 'json2xml' ? t.phPasteJson : t.phPasteJson }}
      outputEditor={{ language: direction === 'json2xml' ? 'xml' : 'json' }}
      options={
        <OptionBar label={t.direction}>
          <SelectOption
            label=""
            value={direction}
            options={[
              { label: 'JSON → XML', value: 'json2xml' },
              { label: 'XML → JSON', value: 'xml2json' },
            ]}
            onChange={(v) => setDirection(v as Direction)}
          />
          {direction === 'json2xml' && (
            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              {t.rootName}
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="rounded-md border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)] w-24"
              />
            </label>
          )}
        </OptionBar>
      }
    />
  );
}
