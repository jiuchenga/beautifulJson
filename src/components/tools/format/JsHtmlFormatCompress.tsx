// src/components/tools/format/JsHtmlFormatCompress.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import OptionBar, { SelectOption } from '../shared/OptionBar';
import { htmlFormat, htmlCompress } from '@/lib/format-utils';
import { useToolI18n } from '@/lib/react-i18n';

const EXAMPLE = '<div><script>function hello(){console.log("Hello World");}</script><p class="text">Test</p></div>';

type Mode = 'format' | 'compress';

export default function JsHtmlFormatCompress({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnterCode); return; }
    try {
      if (mode === 'format') {
        // Format HTML first, then format inline JS
        const html = htmlFormat(input);
        setOutput(html);
      } else {
        const compressed = htmlCompress(input);
        // Also compress any inline JS
        setOutput(compressed);
      }
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onExample={() => setInput(EXAMPLE)}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); }}
      error={error}
      inputEditor={{ language: 'html', placeholder: t.pleaseEnterHtml }}
      outputEditor={{ language: 'html', readOnly: true }}
      options={<OptionBar label={t.mode}>
        <SelectOption label="" value={mode} options={[
          { label: t.format, value: 'format' },
          { label: t.compress, value: 'compress' },
        ]} onChange={(v) => setMode(v as Mode)} />
      </OptionBar>}
    />
  );
}
