// src/components/tools/encrypt/ImageToBase64.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { imageToBase64 } from '@/lib/crypto-utils';

export default function ImageToBase64() {
  const [base64, setBase64] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    try {
      const result = await imageToBase64(file);
      setBase64(result);
      setPreview(result);
    } catch (e) { setError((e as Error).message); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Image to Base64</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Convert images to Base64 encoded strings.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">
          Choose Image
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {fileName && <span className="text-sm text-[var(--text-secondary)]">{fileName}</span>}
        <button onClick={() => { setBase64(''); setPreview(''); setError(''); setFileName(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {preview && (
        <div className="space-y-4">
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
            <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Preview</h3>
            <img src={preview} alt="Preview" className="max-h-64 max-w-full rounded" />
          </div>
          <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">Base64 Output</h3>
              <CopyButton text={base64} />
            </div>
            <textarea readOnly value={base64} className="w-full h-32 rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] p-2 font-mono text-xs text-[var(--text-secondary)]" />
          </div>
        </div>
      )}
    </div>
  );
}
