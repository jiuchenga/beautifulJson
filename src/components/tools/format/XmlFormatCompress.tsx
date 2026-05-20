// src/components/tools/format/XmlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { xmlFormat, xmlCompress } from '@/lib/format-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '<root><item id="1"><name>Test</name><value>123</value></item><item id="2"><name>Demo</name><value>456</value></item></root>';

type Mode = 'format' | 'compress';

export default function XmlFormatCompress({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterXml); return; }
    try { setOutput(mode === 'format' ? xmlFormat(input) : xmlCompress(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'xml', placeholder: t.pleaseEnterXml }}
      outputEditor={{ language: 'xml', readOnly: true }}
      options={<OptionBar label={t.mode}>
        <SelectOption label="" value={mode} options={[
          { label: t.formatBeautify, value: 'format' },
          { label: t.compressMinify, value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
