// src/components/tools/webmaster/HttpStatusCheck.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

const HTTP_CODES: Record<number, string> = {
  200: 'OK - The request has succeeded.',
  201: 'Created - The request has been fulfilled and a new resource has been created.',
  204: 'No Content - The server successfully processed the request but returns no content.',
  301: 'Moved Permanently - The resource has been permanently moved to a new URL.',
  302: 'Found - The resource has been temporarily moved to a different URL.',
  304: 'Not Modified - The resource has not been modified since the last request.',
  400: 'Bad Request - The server cannot understand the request due to invalid syntax.',
  401: 'Unauthorized - Authentication is required to access the resource.',
  403: 'Forbidden - The server understood the request but refuses to authorize it.',
  404: 'Not Found - The server cannot find the requested resource.',
  405: 'Method Not Allowed - The request method is not supported for the resource.',
  408: 'Request Timeout - The server timed out waiting for the request.',
  429: 'Too Many Requests - Rate limiting has been applied.',
  500: 'Internal Server Error - The server encountered an unexpected condition.',
  502: 'Bad Gateway - The server received an invalid response from the upstream server.',
  503: 'Service Unavailable - The server is not ready to handle the request.',
  504: 'Gateway Timeout - The upstream server did not respond in time.',
};

export default function HttpStatusCheck() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<{ code: number; category: string; description: string } | null>(null);
  const [error, setError] = useState('');

  function handleLookup() {
    setError('');
    const num = parseInt(code);
    if (isNaN(num) || num < 100 || num > 599) { setError('Enter a valid HTTP status code (100-599)'); return; }
    const category = num < 200 ? 'Informational' : num < 300 ? 'Success' : num < 400 ? 'Redirection' : num < 500 ? 'Client Error' : 'Server Error';
    setResult({
      code: num,
      category,
      description: HTTP_CODES[num] || 'No detailed description available for this status code.',
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">HTTP Status Code Lookup</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Look up HTTP status codes and their meanings.</p>
      </div>

      <div className="flex gap-3">
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter HTTP status code (e.g., 404)"
          className="w-64 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleLookup} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Look Up</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {result && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-4xl font-bold text-[var(--accent-blue)]">{result.code}</span>
            <CopyButton text={`${result.code} - ${result.description}`} />
          </div>
          <div className="rounded bg-[var(--bg-tertiary)] px-3 py-1.5 text-sm">
            <span className="font-medium text-[var(--text-secondary)]">Category: </span>
            <span className="text-[var(--text-primary)]">{result.category}</span>
          </div>
          <p className="text-sm text-[var(--text-primary)]">{result.description}</p>
        </div>
      )}

      {/* Quick reference */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Common Status Codes</h3>
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
          {Object.entries(HTTP_CODES).map(([code, desc]) => (
            <button key={code} onClick={() => { setCode(code); handleLookup(); }}
              className="rounded px-2 py-1 text-left text-xs hover:bg-[var(--bg-tertiary)]">
              <span className="font-mono font-bold text-[var(--accent-blue)]">{code}</span>
              <span className="ml-1 text-[var(--text-tertiary)]">{desc.split(' - ')[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
