// src/components/tools/webmaster/HeadersCheck.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

export default function HeadersCheck({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setError('');
    setHeaders(null);
    if (!url.trim()) { setError(t.pleaseEnterUrl); return; }
    setLoading(true);
    try {
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      // Use allorigins proxy to bypass CORS and get response headers
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
      const proxyResp = await fetch(proxyUrl);
      if (!proxyResp.ok) throw new Error(t.corsError);
      const data = await proxyResp.json();
      const headerObj: Record<string, string> = {};
      // allorigins returns { contents, status: { http_code, content_type, ... } }
      if (data.status) {
        headerObj['status'] = String(data.status.http_code ?? '');
        if (data.status.content_type) headerObj['content-type'] = data.status.content_type;
        if (data.status.content_length) headerObj['content-length'] = String(data.status.content_length);
        if (data.status.response_time) headerObj['response-time'] = `${data.status.response_time} s`;
      }
      // Try direct fetch for actual headers (works when CORS allows)
      try {
        const directResp = await fetch(targetUrl, { method: 'HEAD' });
        directResp.headers.forEach((value, key) => { headerObj[key] = value; });
        headerObj['status'] = `${directResp.status} ${directResp.statusText}`;
      } catch { /* fallback to proxy headers */ }
      if (Object.keys(headerObj).length === 0) throw new Error(t.corsError);
      setHeaders(headerObj);
    } catch (e) {
      setError((e as Error).message);
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'HTTP Headers Check'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Check HTTP response headers for any URL.'}</p>
      </div>

      <div className="flex gap-3">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={t.phEnterUrl}
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleCheck} disabled={loading}
          className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          {loading ? t.checking : t.check}
        </button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {headers && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t.responseHeaders}</h3>
            <CopyButton text={JSON.stringify(headers, null, 2)} lang={lang} />
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
