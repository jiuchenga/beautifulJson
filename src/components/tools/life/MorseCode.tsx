// src/components/tools/life/MorseCode.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { useToolI18n } from '@/lib/react-i18n';

const MORSE_MAP: Record<string, string> = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---',
  '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', ' ': '/',
};

const REVERSE_MORSE = Object.fromEntries(Object.entries(MORSE_MAP).map(([k, v]) => [v, k]));

function textToMorse(text: string): string {
  return text.toUpperCase().split('').map(c => MORSE_MAP[c] || '').filter(Boolean).join(' ');
}

function morseToText(morse: string): string {
  return morse.split(' ').map(code => REVERSE_MORSE[code] || '').join('');
}

const EXAMPLE = 'HELLO WORLD';

export default function MorseCode({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'text2morse' | 'morse2text'>('text2morse');

  function handleExecute() {
    setError('');
    if (!input.trim()) { setError(t.pleaseEnter); return; }
    try { setOutput(mode === 'text2morse' ? textToMorse(input) : morseToText(input)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <ToolShell lang={lang} title={toolTitle ?? ''} description={toolDesc ?? ''}
      inputValue={input} onInputChange={setInput} outputValue={output}
      onExecute={handleExecute}
      onClear={() => { setInput(''); setOutput(''); setError(''); }}
      onSwap={() => { const tmp = input; setInput(output); setOutput(tmp); setMode(mode === 'text2morse' ? 'morse2text' : 'text2morse'); }}
      onExample={() => setInput(mode === 'text2morse' ? EXAMPLE : '.... . .-.. .-.. --- / .-- --- .-. .-.. -..')}
      error={error}
      inputEditor={{ placeholder: mode === 'text2morse' ? 'Enter text...' : 'Enter Morse code...' }}
      options={<div className="flex gap-2">
        <button onClick={() => setMode('text2morse')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'text2morse' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.textToMorse}</button>
        <button onClick={() => setMode('morse2text')} className={`rounded-lg px-3 py-1 text-sm ${mode === 'morse2text' ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)]'}`}>{t.morseToText}</button>
      </div>}
    />
  );
}
