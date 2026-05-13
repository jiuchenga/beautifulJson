// src/components/tools/webmaster\UserAgentParser.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function UserAgentParser() {
  const [ua, setUa] = useState('');

  function parseUA(userAgent: string) {
    const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera|MSIE|Trident)\/[\d.]+/)?.[0] || 'Unknown';
    const os = userAgent.match(/(Windows NT [\d.]+|Mac OS X [\d_]+|Linux|Android [\d.]+|iPhone OS [\d_]+|iPad)/)?.[0] || 'Unknown';
    const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
    const isBot = /bot|crawler|spider|slurp/i.test(userAgent);
    return { browser, os, isMobile, isBot, raw: userAgent };
  }

  const info = ua ? parseUA(ua) : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">User Agent Parser</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Parse and analyze User-Agent strings.</p>
      </div>

      <div className="flex gap-3">
        <input type="text" value={ua} onChange={(e) => setUa(e.target.value)} placeholder="Paste User-Agent string..."
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={() => setUa(navigator.userAgent)} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">My UA</button>
      </div>

      {info && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded bg-[var(--bg-tertiary)] p-3">
              <span className="text-xs text-[var(--text-tertiary)]">Browser</span>
              <div className="font-mono text-sm text-[var(--text-primary)]">{info.browser}</div>
            </div>
            <div className="rounded bg-[var(--bg-tertiary)] p-3">
              <span className="text-xs text-[var(--text-tertiary)]">OS</span>
              <div className="font-mono text-sm text-[var(--text-primary)]">{info.os}</div>
            </div>
            <div className="rounded bg-[var(--bg-tertiary)] p-3">
              <span className="text-xs text-[var(--text-tertiary)]">Mobile</span>
              <div className="text-sm text-[var(--text-primary)]">{info.isMobile ? 'Yes' : 'No'}</div>
            </div>
            <div className="rounded bg-[var(--bg-tertiary)] p-3">
              <span className="text-xs text-[var(--text-tertiary)]">Bot</span>
              <div className="text-sm text-[var(--text-primary)]">{info.isBot ? 'Yes' : 'No'}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-tertiary)]">Raw UA String</span>
            <CopyButton text={info.raw} />
          </div>
          <pre className="whitespace-pre-wrap rounded bg-[var(--bg-tertiary)] p-2 font-mono text-xs text-[var(--text-secondary)]">{info.raw}</pre>
        </div>
      )}
    </div>
  );
}
