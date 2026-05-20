// src/components/tools/qr/QrCodeGenerator.tsx
import { useState } from 'react';
import QRCode from 'qrcode';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

type QrType = 'text' | 'url' | 'email' | 'sms' | 'phone' | 'wifi' | 'vcard';

export default function QrCodeGenerator({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const QR_TYPES: { label: string; value: QrType }[] = [
    { label: t.text, value: 'text' },
    { label: t.url, value: 'url' },
    { label: t.email, value: 'email' },
    { label: t.sms, value: 'sms' },
    { label: t.phone, value: 'phone' },
    { label: t.wifi, value: 'wifi' },
    { label: t.vcard, value: 'vcard' },
  ];
  const [qrType, setQrType] = useState<QrType>('text');
  const [text, setText] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');

  function getContent(): string {
    switch (qrType) {
      case 'email': return text ? `mailto:${text}` : '';
      case 'sms': return text ? `sms:${text}` : '';
      case 'phone': return text ? `tel:${text}` : '';
      case 'wifi': return text ? `WIFI:T:WPA;S:${text};P:${wifiPassword};;` : '';
      case 'vcard': return text ? `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nEND:VCARD` : '';
      default: return text;
    }
  }

  async function handleGenerate() {
    setError('');
    const content = getContent();
    if (!content.trim()) { setError(t.pleaseEnter); return; }
    try {
      const url = await QRCode.toDataURL(content, { width: 300, margin: 2, color: { dark: '#000000', light: '#ffffff' } });
      setDataUrl(url);
    } catch (e) { setError((e as Error).message); }
  }

  function handleDownload() {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `qrcode-${Date.now()}.png`;
    a.click();
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'QR Code Generator'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate QR codes for text, URLs, email, SMS, phone, WiFi, vCard.'}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QR_TYPES.map((qt) => (
          <button key={qt.value} onClick={() => { setQrType(qt.value); setDataUrl(''); setError(''); }}
            className={`rounded-lg px-3 py-1.5 text-sm ${qrType === qt.value ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
            {qt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
          placeholder={qrType === 'text' ? t.phEnterText : qrType === 'url' ? t.phEnterUrl : qrType === 'email' ? t.phEnterText : qrType === 'wifi' ? t.phEnterText : t.phEnterText}
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleGenerate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.generate}</button>
      </div>

      {qrType === 'wifi' && (
        <input type="text" value={wifiPassword} onChange={(e) => setWifiPassword(e.target.value)}
          placeholder={t.phWifiPass}
          className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
      )}

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {dataUrl && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <img src={dataUrl} alt="QR Code" className="h-64 w-64" />
          <div className="flex gap-2">
            <button onClick={handleDownload} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">{t.downloadPng}</button>
            <CopyButton text={dataUrl} lang={lang} />
          </div>
        </div>
      )}

      <button onClick={() => { setText(''); setDataUrl(''); setError(''); }}
        className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.clear}</button>
    </div>
  );
}
