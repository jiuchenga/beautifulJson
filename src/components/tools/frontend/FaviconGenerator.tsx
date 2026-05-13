// src/components/tools/frontend/FaviconGenerator.tsx
import { useState, useRef, useMemo } from 'react';

type FaviconSize = 16 | 32 | 48 | 64 | 128 | 256;

function renderFaviconToCanvas(
  canvas: HTMLCanvasElement,
  size: number,
  text: string,
  bgColor: string,
  fgColor: string,
  fontSize: number,
): string {
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fgColor;
  ctx.font = `bold ${Math.max(8, fontSize * size / 64)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.slice(0, 2), size / 2, size / 2 + 1);
  return canvas.toDataURL('image/png');
}

const SIZES: FaviconSize[] = [16, 32, 48, 64, 128, 256];

export default function FaviconGenerator() {
  const [text, setText] = useState('DT');
  const [bgColor, setBgColor] = useState('#3b82f6');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(20);
  const [previews, setPreviews] = useState<Record<number, string>>({});
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleGenerate() {
    setError('');
    if (!text.trim()) { setError('Please enter text'); return; }
    const canvas = canvasRef.current || document.createElement('canvas');
    const results: Record<number, string> = {};
    for (const size of SIZES) {
      results[size] = renderFaviconToCanvas(canvas, size, text, bgColor, fgColor, fontSize);
    }
    setPreviews(results);
  }

  function handleDownload(size: FaviconSize) {
    const dataUrl = previews[size];
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `favicon-${size}x${size}.png`;
    a.click();
  }

  const hasPreview = Object.keys(previews).length > 0;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Favicon Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate favicon icons from text with custom colors.</p>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Text (1-2 chars)</label>
            <input type="text" value={text} onChange={(e) => setText(e.target.value.slice(0, 2))} maxLength={2}
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 text-center text-2xl font-bold text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Background</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-10 w-full rounded border cursor-pointer" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Text Color</label>
              <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-10 w-full rounded border cursor-pointer" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Font Size: {fontSize}px</label>
            <input type="range" min={8} max={40} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" />
          </div>
          <button onClick={handleGenerate} className="w-full rounded-lg bg-[var(--accent-blue)] py-2 text-sm font-medium text-white hover:opacity-90">Generate</button>
        </div>

        <div className="flex flex-col items-center gap-4">
          {hasPreview ? (
            <>
              <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                <div className="grid grid-cols-3 gap-4 items-end">
                  {SIZES.map((size) => (
                    <div key={size} className="text-center">
                      <img src={previews[size]} alt={`${size}x${size}`} className="mx-auto mb-1" style={{ width: Math.min(size, 64), height: Math.min(size, 64), imageRendering: 'pixelated' }} />
                      <span className="text-xs text-[var(--text-tertiary)]">{size}x{size}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button key={size} onClick={() => handleDownload(size)}
                    className="rounded-lg border border-[var(--border-primary)] px-3 py-1 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">
                    {size}x{size}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <span className="text-sm text-[var(--text-tertiary)]">Click Generate to preview</span>
          )}
        </div>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}
    </div>
  );
}
