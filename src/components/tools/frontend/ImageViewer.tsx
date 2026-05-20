// src/components/tools/frontend/ImageViewer.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';

export default function ImageViewer({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [info, setInfo] = useState<{ name: string; size: string; type: string; width: number; height: number; ratio: string } | null>(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeKB = file.size / 1024;
    const sizeStr = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(2)} MB` : `${sizeKB.toFixed(2)} KB`;

    const img = new Image();
    img.onload = () => {
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const d = gcd(img.width, img.height);
      setInfo({
        name: file.name,
        size: sizeStr,
        type: file.type,
        width: img.width,
        height: img.height,
        ratio: `${img.width / d}:${img.height / d}`,
      });
      setPreview(URL.createObjectURL(file));
    };
    img.onerror = () => setError('Failed to load image');
    img.src = URL.createObjectURL(file);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Image Info Viewer'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'View image dimensions, size, type, and aspect ratio.'}</p>
      </div>

      <label className="cursor-pointer rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 inline-block">
        {t.chooseImage}
        <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </label>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {info && preview && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <img src={preview} alt="Preview" className="max-h-72 rounded-lg border border-[var(--border-primary)]" />
          <div className="space-y-2">
            {[
              [t.fileName, info.name],
              [t.fileSize, info.size],
              [t.mimeType, info.type],
              [t.widthLabel, `${info.width}px`],
              [t.heightLabel, `${info.height}px`],
              [t.aspectRatio, info.ratio],
              [t.megapixels, `${((info.width * info.height) / 1e6).toFixed(2)} MP`],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded border border-[var(--border-primary)] bg-[var(--bg-secondary)] px-3 py-2">
                <span className="text-sm text-[var(--text-tertiary)]">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-[var(--text-primary)]">{value}</span>
                  <CopyButton text={value} lang={lang} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
