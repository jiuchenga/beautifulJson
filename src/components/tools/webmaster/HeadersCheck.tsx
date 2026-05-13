// src/components/tools/webmaster/HeadersCheck.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function HeadersCheck() {
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setError('');
    setHeaders(null);
    if (!url.trim()) { setError('Please enter a URL'); return; }
    setLoading(true);
    try {
      // Use a CORS proxy for client-side requests
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const response = await fetch(targetUrl, { method: 'HEAD', mode: 'no-cors' });
      const headerObj: Record<string, string> = {};
      response.headers.forEach((value, key) => { headerObj[key] = value; });
      headerObj['status'] = `${response.status} ${response.statusText}`;
      headerObj['type'] = response.type;
      setHeaders(headerObj);
    } catch (e) {
      setError(`Could not fetch headers: ${(e as Error).message}. Note: CORS restrictions may prevent client-side header inspection.`);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">HTTP Headers Check</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Check HTTP response headers for any URL.</p>
      </div>

      <div className="flex gap-3">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter URL (e.g., https://example.com)"
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleCheck} disabled={loading}
          className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {headers && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Response Headers</h3>
            <CopyButton text={JSON.stringify(headers, null, 2)} />
          </div>
          <div className="space-y-1">
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 rounded px-3 py-1.5 text-sm hover:bg-[var(--bg-tertiary)]">
                <span className="min-w-40 font-mono text-[var(--accent-blue)]">{key}:</span>
                <span className="font-mono text-[var(--text-primary)]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
