// src/components/tools/qr/QrCodeBeautifier.tsx
import { useState } from 'react';
import QRCode from 'qrcode';
import { useToolI18n } from '@/lib/react-i18n';

export default function QrCodeBeautifier({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [text, setText] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [margin, setMargin] = useState(2);
  const [dataUrl, setDataUrl] = useState('');
  const [error, setError] = useState('');

  async function handleGenerate() {
    setError('');
    if (!text.trim()) { setError(t.pleaseEnter); return; }
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin,
        color: { dark: fgColor, light: bgColor },
      });
      setDataUrl(url);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'QR Code Beautifier'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate styled QR codes with custom colors and size.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.content}</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)}
              placeholder={t.phTextOrUrl}
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.foreground}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-10 rounded border" />
                <input type="text" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="flex-1 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-mono" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.background}</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-10 rounded border" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1 text-sm font-mono" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.size}: {size}px</label>
              <input type="range" min={100} max={1000} step={50} value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.margin}: {margin}</label>
              <input type="range" min={0} max={10} value={margin} onChange={(e) => setMargin(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <button onClick={handleGenerate} className="w-full rounded-lg bg-[var(--accent-blue)] py-2 text-sm font-medium text-white hover:opacity-90">{t.qrGenerate}</button>
        </div>

        <div className="flex flex-col items-center justify-center rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
          {dataUrl ? (
            <>
              <img src={dataUrl} alt="QR Code" className="max-h-72 max-w-72" />
              <button onClick={() => { const a = document.createElement('a'); a.href = dataUrl; a.download = `qr-beautified-${Date.now()}.png`; a.click(); }}
                className="mt-4 rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">{t.downloadPng}</button>
            </>
          ) : (
            <span className="text-sm text-[var(--text-tertiary)]">{t.qrPreview}</span>
          )}
        </div>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}
    </div>
  );
}
