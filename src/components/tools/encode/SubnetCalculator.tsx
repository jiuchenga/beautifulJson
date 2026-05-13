// src/components/tools/encode/SubnetCalculator.tsx
import { useState } from 'react';
import { calculateSubnet, type SubnetInfo } from '@/lib/convert-utils';
import CopyButton from '@/components/ui/CopyButton';

const EXAMPLE_IP = '192.168.1.100';
const EXAMPLE_CIDR = '24';

export default function SubnetCalculator() {
  const [ip, setIp] = useState('');
  const [cidrOrMask, setCidrOrMask] = useState('');
  const [result, setResult] = useState<SubnetInfo | null>(null);
  const [error, setError] = useState('');

  function handleCalculate() {
    setError('');
    if (!ip.trim() || !cidrOrMask.trim()) { setError('Please enter IP and CIDR/mask'); return; }
    try { setResult(calculateSubnet(ip, cidrOrMask)); } catch (e) { setError((e as Error).message); setResult(null); }
  }

  const rows = result ? [
    ['CIDR', `/${result.cidr}`],
    ['Subnet Mask', result.mask],
    ['Wildcard Mask', result.wildcard],
    ['Network Address', result.network],
    ['Broadcast Address', result.broadcast],
    ['Total Hosts', String(result.hosts)],
    ['First Host', result.firstHost],
    ['Last Host', result.lastHost],
  ] : [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Subnet Mask Calculator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Calculate subnet information from IP address and CIDR or subnet mask.</p>
      </div>

      <div className="flex gap-3">
        <input type="text" value={ip} onChange={(e) => setIp(e.target.value)} placeholder="IP Address (e.g., 192.168.1.100)"
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <input type="text" value={cidrOrMask} onChange={(e) => setCidrOrMask(e.target.value)} placeholder="CIDR (e.g., 24) or mask"
          className="w-48 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleCalculate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Calculate</button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => { setIp(EXAMPLE_IP); setCidrOrMask(EXAMPLE_CIDR); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Example</button>
        <button onClick={() => { setIp(''); setCidrOrMask(''); setResult(null); setError(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {result && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-3 text-sm font-medium text-[var(--text-secondary)]">Subnet Information</h3>
          <div className="space-y-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-3 py-2">
                <span className="text-sm text-[var(--text-tertiary)]">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[var(--text-primary)]">{value}</span>
                  <CopyButton text={value} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
