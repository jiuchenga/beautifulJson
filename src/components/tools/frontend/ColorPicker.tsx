// src/components/tools/frontend/ColorPicker.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, Math.round(l * 100)];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? ((g - b) / d + (g < b ? 6 : 0)) / 6 : max === g ? ((b - r) / d + 2) / 6 : ((r - g) / d + 4) / 6;
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPicker() {
  const [hex, setHex] = useState('#3b82f6');
  const [r, setR] = useState(59);
  const [g, setG] = useState(130);
  const [b, setB] = useState(246);

  function updateFromHex(h: string) {
    setHex(h);
    if (/^#[0-9a-fA-F]{6}$/.test(h)) {
      const [rv, gv, bv] = hexToRgb(h);
      setR(rv); setG(gv); setB(bv);
    }
  }

  function updateFromRgb(rv: number, gv: number, bv: number) {
    setR(rv); setG(gv); setB(bv);
    const h = '#' + [rv, gv, bv].map(v => v.toString(16).padStart(2, '0')).join('');
    setHex(h);
  }

  const [h, s, l] = rgbToHsl(r, g, b);
  const formats = {
    hex: hex.toUpperCase(),
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    css: `--color: ${hex};`,
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Web Color Picker</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Pick colors and get HEX, RGB, HSL values.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Color</label>
            <div className="flex gap-3">
              <input type="color" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="h-12 w-20 rounded border cursor-pointer" />
              <input type="text" value={hex} onChange={(e) => updateFromHex(e.target.value)} className="flex-1 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 font-mono text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">RGB</label>
            <div className="flex gap-3">
              {['R', 'G', 'B'].map((ch, i) => (
                <div key={ch} className="flex-1">
                  <span className="text-xs text-[var(--text-tertiary)]">{ch}</span>
                  <input type="range" min={0} max={255} value={[r, g, b][i]}
                    onChange={(e) => { const vals = [r, g, b]; vals[i] = Number(e.target.value); updateFromRgb(vals[0], vals[1], vals[2]); }}
                    className="w-full" />
                  <span className="text-xs font-mono">{[r, g, b][i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-3 h-32" style={{ backgroundColor: hex }} />
        </div>

        <div className="space-y-2">
          {Object.entries(formats).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2">
              <span className="text-xs font-medium uppercase text-[var(--text-tertiary)]">{key}</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-sm text-[var(--text-primary)]">{value}</code>
                <CopyButton text={value} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
