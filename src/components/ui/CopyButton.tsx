// src/components/ui/CopyButton.tsx
import { useState } from 'react';
import { useToolI18n } from '@/lib/react-i18n';

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
  lang?: string;
}

export default function CopyButton({ text, label, className = '', lang }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const t = useToolI18n(lang);

  async function handleCopy() {
    if (!text) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP or older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (!ok) return;
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Final fallback
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch { /* clipboard unavailable */ }
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`rounded-md px-2 py-1 text-xs transition-colors ${
        copied
          ? 'bg-accent-green/10 text-accent-green'
          : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
      } disabled:opacity-30 ${className}`}
    >
      {copied ? t.copied : (label || t.copy)}
    </button>
  );
}
