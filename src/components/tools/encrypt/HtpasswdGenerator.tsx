// src/components/tools/encrypt/HtpasswdGenerator.tsx
import { useState } from 'react';
import ToolShell from '../ToolShell';
import { generateHtpasswd } from '@/lib/crypto-utils';
import { useToolI18n } from '@/lib/react-i18n';

export default function HtpasswdGenerator({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  function handleExecute() {
    setError('');
    if (!username.trim()) { setError(t.pleaseEnterUsername); return; }
    if (!password.trim()) { setError(t.pleaseEnterPassword); return; }
    try { setOutput(generateHtpasswd(username, password)); } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'htpasswd Generator'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate Apache htpasswd entries.'}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.username}</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin"
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.password}</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
            className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleExecute} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.generate}</button>
        <button onClick={() => { setUsername(''); setPassword(''); setOutput(''); setError(''); }} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
      </div>
      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}
      {output && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <p className="mb-2 text-sm font-medium text-[var(--text-secondary)]">{t.htpasswdEntry}</p>
          <pre className="font-mono text-sm text-[var(--text-primary)] select-all">{output}</pre>
        </div>
      )}
    </div>
  );
}
