// src/components/tools/other/CronGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Every day at midnight', value: '0 0 * * *' },
  { label: 'Every Monday at 9am', value: '0 9 * * 1' },
  { label: 'Every 15 minutes', value: '*/15 * * * *' },
  { label: 'First day of month', value: '0 0 1 * *' },
  { label: 'Every Sunday at noon', value: '0 12 * * 0' },
  { label: 'Every weekday at 9am', value: '0 9 * * 1-5' },
];

export default function CronGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');

  const cronExpr = [minute, hour, day, month, weekday].join(' ');

  const descriptions: Record<string, string> = {
    '* * * * *': 'Every minute',
    '0 * * * *': 'Every hour',
    '0 0 * * *': 'Every day at midnight',
    '*/15 * * * *': 'Every 15 minutes',
    '0 9 * * 1-5': 'Every weekday at 9:00 AM',
    '0 0 1 * *': 'First day of every month at midnight',
    '0 12 * * 0': 'Every Sunday at noon',
    '0 9 * * 1': 'Every Monday at 9:00 AM',
  };

  const fields = [
    { label: 'Minute', value: minute, set: setMinute, range: '0-59', desc: 'e.g., 0, */5, 15,30' },
    { label: 'Hour', value: hour, set: setHour, range: '0-23', desc: 'e.g., 0, */2, 9-17' },
    { label: 'Day of Month', value: day, set: setDay, range: '1-31', desc: 'e.g., 1, */2, 1,15' },
    { label: 'Month', value: month, set: setMonth, range: '1-12', desc: 'e.g., *, 1,6,12' },
    { label: 'Day of Week', value: weekday, set: setWeekday, range: '0-6', desc: 'e.g., *, 1-5, 0,6' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Cron Expression Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate and understand cron expressions.</p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button key={p.label} onClick={() => { const parts = p.value.split(' '); setMinute(parts[0]); setHour(parts[1]); setDay(parts[2]); setMonth(parts[3]); setWeekday(parts[4]); }}
            className="rounded-lg border border-[var(--border-primary)] px-3 py-1.5 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
            {p.label}
          </button>
        ))}
      </div>

      {/* Fields */}
      <div className="grid grid-cols-5 gap-3">
        {fields.map((f) => (
          <div key={f.label}>
            <label className="mb-1 block text-xs font-medium text-[var(--text-secondary)]">{f.label} ({f.range})</label>
            <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)}
              className="w-full rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2 font-mono text-sm text-center text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            <span className="text-[10px] text-[var(--text-tertiary)]">{f.desc}</span>
          </div>
        ))}
      </div>

      {/* Output */}
      <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--text-secondary)]">Cron Expression</h3>
          <CopyButton text={cronExpr} />
        </div>
        <code className="text-2xl font-bold text-[var(--accent-blue)]">{cronExpr}</code>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{descriptions[cronExpr] || 'Custom schedule'}</p>
      </div>
    </div>
  );
}
