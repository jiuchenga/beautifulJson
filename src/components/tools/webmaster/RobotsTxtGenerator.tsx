// src/components/tools/webmaster/RobotsTxtGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

interface Rule {
  userAgent: string;
  disallow: string[];
  allow: string[];
}

export default function RobotsTxtGenerator() {
  const [rules, setRules] = useState<Rule[]>([{ userAgent: '*', disallow: ['/admin/', '/api/'], allow: ['/'] }]);
  const [sitemap, setSitemap] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');

  function addRule() {
    setRules([...rules, { userAgent: '*', disallow: [], allow: [] }]);
  }

  function updateRule(index: number, field: 'userAgent', value: string) {
    const updated = [...rules];
    updated[index] = { ...updated[index], [field]: value };
    setRules(updated);
  }

  function addPath(index: number, type: 'disallow' | 'allow', path: string) {
    if (!path.trim()) return;
    const updated = [...rules];
    updated[index] = { ...updated[index], [type]: [...updated[index][type], path] };
    setRules(updated);
  }

  function removePath(index: number, type: 'disallow' | 'allow', pathIndex: number) {
    const updated = [...rules];
    updated[index] = { ...updated[index], [type]: updated[index][type].filter((_, i) => i !== pathIndex) };
    setRules(updated);
  }

  function removeRule(index: number) {
    setRules(rules.filter((_, i) => i !== index));
  }

  const output = rules.map((rule) => {
    const lines = [`User-agent: ${rule.userAgent}`];
    rule.disallow.forEach(p => lines.push(`Disallow: ${p}`));
    rule.allow.forEach(p => lines.push(`Allow: ${p}`));
    if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
    return lines.join('\n');
  }).join('\n\n') + (sitemap ? `\n\nSitemap: ${sitemap}` : '');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">robots.txt Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate a robots.txt file for your website.</p>
      </div>

      {/* Rules */}
      <div className="space-y-3">
        {rules.map((rule, i) => (
          <div key={i} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <input type="text" value={rule.userAgent} onChange={(e) => updateRule(i, 'userAgent', e.target.value)}
                className="rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-mono" placeholder="User-agent" />
              {rules.length > 1 && (
                <button onClick={() => removeRule(i)} className="text-xs text-[var(--accent-red)] hover:underline">Remove</button>
              )}
            </div>
            <div className="flex gap-4 text-xs">
              <div>
                <span className="font-medium text-[var(--text-secondary)]">Disallow:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rule.disallow.map((p, j) => (
                    <span key={j} className="inline-flex items-center gap-1 rounded bg-[var(--bg-tertiary)] px-2 py-0.5">
                      <code>{p}</code>
                      <button onClick={() => removePath(i, 'disallow', j)} className="text-[var(--accent-red)]">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium text-[var(--text-secondary)]">Allow:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {rule.allow.map((p, j) => (
                    <span key={j} className="inline-flex items-center gap-1 rounded bg-[var(--bg-tertiary)] px-2 py-0.5">
                      <code>{p}</code>
                      <button onClick={() => removePath(i, 'allow', j)} className="text-[var(--accent-red)]">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <PathInput onAdd={(path) => addPath(i, 'disallow', path)} placeholder="Add disallow path" />
            <PathInput onAdd={(path) => addPath(i, 'allow', path)} placeholder="Add allow path" />
          </div>
        ))}
      </div>

      <button onClick={addRule} className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Add Rule</button>

      <div className="flex gap-3">
        <input type="text" value={sitemap} onChange={(e) => setSitemap(e.target.value)} placeholder="Sitemap URL (optional)"
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
      </div>

      <input type="text" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} placeholder="Crawl delay in seconds (optional)"
        className="w-64 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />

      {/* Output */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">robots.txt Output</h3>
          <CopyButton text={output} />
        </div>
        <pre className="whitespace-pre-wrap rounded bg-[var(--bg-tertiary)] p-3 font-mono text-sm text-[var(--text-primary)] select-all">{output}</pre>
      </div>
    </div>
  );
}

function PathInput({ onAdd, placeholder }: { onAdd: (path: string) => void; placeholder: string }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex gap-2">
      <input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder}
        className="flex-1 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-xs font-mono"
        onKeyDown={(e) => { if (e.key === 'Enter') { onAdd(value); setValue(''); } }} />
      <button onClick={() => { onAdd(value); setValue(''); }} className="rounded border border-[var(--border-primary)] px-2 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Add</button>
    </div>
  );
}
