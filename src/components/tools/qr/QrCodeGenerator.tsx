// src/components/tools/qr/QrCodeGenerator.tsx
import { useState } from 'react';
import QRCode from 'qrcode';
import CopyButton from '@/components/ui/CopyButton';

type QrType = 'text' | 'url' | 'email' | 'sms' | 'phone' | 'wifi' | 'vcard';

const QR_TYPES: { label: string; value: QrType }[] = [
  { label: 'Text', value: 'text' },
  { label: 'URL', value: 'url' },
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Phone', value: 'phone' },
  { label: 'WiFi', value: 'wifi' },
  { label: 'vCard', value: 'vcard' },
];

export default function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('text');
  const [text, setText] = useState('');
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  function getContent(): string {
    switch (qrType) {
      case 'email': return text ? `mailto:${text}` : '';
      case 'sms': return text ? `sms:${text}` : '';
      case 'phone': return text ? `tel:${text}` : '';
      case 'wifi': return text ? `WIFI:T:WPA;S:${text};P:password;;` : '';
      case 'vcard': return text ? `BEGIN:VCARD\nVERSION:3.0\nFN:${text}\nEND:VCARD` : '';
      default: return text;
    }
  }

  async function handleGenerate() {
    setError('');
    const content = getContent();
    if (!content.trim()) { setError('Please enter content'); return; }
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">QR Code Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate QR codes for text, URLs, email, SMS, phone, WiFi, vCard.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {QR_TYPES.map((t) => (
          <button key={t.value} onClick={() => { setQrType(t.value); setDataUrl(''); setError(''); }}
            className={`rounded-lg px-3 py-1.5 text-sm ${qrType === t.value ? 'bg-[var(--accent-blue)] text-white' : 'border border-[var(--border-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
          placeholder={qrType === 'text' ? 'Enter text...' : qrType === 'url' ? 'Enter URL...' : qrType === 'email' ? 'Enter email...' : qrType === 'wifi' ? 'Enter network name...' : 'Enter value...'}
          className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
        <button onClick={handleGenerate} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Generate</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {dataUrl && (
        <div className="flex flex-col items-center gap-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          <img src={dataUrl} alt="QR Code" className="h-64 w-64" />
          <div className="flex gap-2">
            <button onClick={handleDownload} className="rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">Download PNG</button>
            <CopyButton text={dataUrl} />
          </div>
        </div>
      )}

      <button onClick={() => { setText(''); setDataUrl(''); setError(''); }}
        className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
    </div>
  );
}
