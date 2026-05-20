// src/components/tools/qr/QrCodeKnowledge.tsx
import { useState } from 'react';
import { useToolI18n } from '@/lib/react-i18n';

const faqs = [
  { q: 'What is a QR code?', a: 'A QR (Quick Response) code is a two-dimensional barcode that can store various types of data, including URLs, text, contact information, and more. It was invented in 1994 by Denso Wave, a Japanese company.' },
  { q: 'How much data can a QR code store?', a: 'A standard QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data. The capacity depends on the version and error correction level.' },
  { q: 'What are the error correction levels?', a: 'QR codes have four error correction levels: L (7% recovery), M (15% recovery), Q (25% recovery), H (30% recovery). Higher levels provide more resilience but reduce data capacity.' },
  { q: 'What is the minimum size for a QR code?', a: 'The minimum recommended size is 2 x 2 cm (0.8 x 0.8 inches). For scanning from a distance, the size should be approximately 10% of the scanning distance.' },
  { q: 'Can QR codes be customized?', a: 'Yes! QR codes can be customized with different colors, logos, and rounded modules. However, ensure sufficient contrast between foreground and background for reliable scanning.' },
  { q: 'Are QR codes secure?', a: 'QR codes themselves are not secure. They can contain malicious URLs. Always verify the content before following links from unknown QR codes.' },
  { q: 'What formats can QR codes encode?', a: 'QR codes can encode: plain text, URLs, email addresses, phone numbers, SMS messages, WiFi credentials, vCard contact information, geographic coordinates, and more.' },
  { q: 'What is the difference between QR code versions?', a: 'QR codes range from Version 1 (21×21 modules) to Version 40 (177×177 modules). Higher versions can store more data but are larger and more complex.' },
];

export default function QrCodeKnowledge({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'QR Code Knowledge'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Frequently asked questions and encyclopedia about QR codes.'}</p>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)]">
            <button onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between p-4 text-left">
              <span className="text-sm font-medium text-[var(--text-primary)]">{faq.q}</span>
              <svg className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div className="border-t border-[var(--border-primary)] px-4 py-3">
                <p className="text-sm text-[var(--text-secondary)]">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
