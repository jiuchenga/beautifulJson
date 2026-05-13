// src/components/tools/qr/QrCodeDecoder.tsx
import { useState, useRef } from 'react';
import jsQR from 'jsqr';

export default function QrCodeDecoder() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError('');
    setResult('');
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) { setError('Canvas not supported'); return; }
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        setResult(code.data);
      } else {
        setError('No QR code found in the image');
      }
    };
    img.onerror = () => { URL.revokeObjectURL(objectUrl); setError('Failed to load image'); };
    img.src = objectUrl;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">QR Code Decoder</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Upload an image to decode the QR code embedded in it.</p>
      </div>

      <div className="flex items-center gap-4">
        <label className="cursor-pointer rounded-lg bg-[var(--accent-blue)] px-6 py-2 text-sm font-medium text-white hover:opacity-90">
          Choose Image
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        {fileName && <span className="text-sm text-[var(--text-secondary)]">{fileName}</span>}
        <button onClick={() => { setResult(''); setError(''); setFileName(''); }}
          className="rounded-lg border border-[var(--border-primary)] px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]">Clear</button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {error && <div className="rounded-lg border border-[var(--accent-red)]/30 bg-[var(--accent-red)]/10 px-4 py-3 text-sm text-[var(--accent-red)]">{error}</div>}

      {result && (
        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Decoded Content</h3>
          <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--text-primary)] select-all rounded bg-[var(--bg-tertiary)] p-3">{result}</pre>
        </div>
      )}
    </div>
  );
}
