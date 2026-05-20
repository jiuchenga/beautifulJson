// src/components/tools/life/WorldTime.tsx
import { useState, useEffect } from 'react';
import { useToolI18n } from '@/lib/react-i18n';

const ZONES = [
  { label: 'UTC', tz: 'UTC' },
  { label: 'New York', tz: 'America/New_York' },
  { label: 'Los Angeles', tz: 'America/Los_Angeles' },
  { label: 'London', tz: 'Europe/London' },
  { label: 'Paris', tz: 'Europe/Paris' },
  { label: 'Berlin', tz: 'Europe/Berlin' },
  { label: 'Moscow', tz: 'Europe/Moscow' },
  { label: 'Dubai', tz: 'Asia/Dubai' },
  { label: 'Mumbai', tz: 'Asia/Kolkata' },
  { label: 'Shanghai', tz: 'Asia/Shanghai' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' },
  { label: 'Seoul', tz: 'Asia/Seoul' },
  { label: 'Singapore', tz: 'Asia/Singapore' },
  { label: 'Sydney', tz: 'Australia/Sydney' },
  { label: 'Auckland', tz: 'Pacific/Auckland' },
];

export default function WorldTime({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [now, setNow] = useState(new Date());

  const LOCALE_MAP: Record<string, string> = {
    en: 'en-US', zh: 'zh-CN', 'zh-tw': 'zh-TW', ja: 'ja-JP', ko: 'ko-KR',
    fr: 'fr-FR', de: 'de-DE', es: 'es-ES', pt: 'pt-BR', ru: 'ru-RU',
    ar: 'ar-SA', hi: 'hi-IN',
  };
  const locale = LOCALE_MAP[lang ?? 'en'] || 'en-US';

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'World Time'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Current time in major cities around the world.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ZONES.map((zone) => {
          const time = now.toLocaleTimeString(locale, { timeZone: zone.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
          const date = now.toLocaleDateString(locale, { timeZone: zone.tz, weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <div key={zone.tz} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--text-secondary)]">{zone.label}</span>
                <span className="text-xs text-[var(--text-tertiary)]">{date}</span>
              </div>
              <div className="mt-1 text-2xl font-bold font-mono text-[var(--accent-blue)] tabular-nums">{time}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
