// src/components/tools/webmaster/MetaTagGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';

export default function MetaTagGenerator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1');
  const [robots, setRobots] = useState('index, follow');
  const [ogType, setOgType] = useState('website');
  const [ogImage, setOgImage] = useState('');
  const [canonical, setCanonical] = useState('');
  const [charset, setCharset] = useState('UTF-8');

  const output = `<!-- Primary Meta Tags -->
<meta charset="${charset}">
<meta name="viewport" content="${viewport}">
<meta name="title" content="${title}">
<meta name="description" content="${description}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}
<meta name="robots" content="${robots}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="${ogType}">
${title ? `<meta property="og:title" content="${title}">` : ''}
${description ? `<meta property="og:description" content="${description}">` : ''}
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
${title ? `<meta name="twitter:title" content="${title}">` : ''}
${description ? `<meta name="twitter:description" content="${description}">` : ''}
${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}
${canonical ? `\n<!-- Canonical -->\n<link rel="canonical" href="${canonical}">` : ''}`.replace(/\n{3,}/g, '\n\n');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Meta Tag Generator</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Generate HTML meta tags for SEO, Open Graph, and Twitter Cards.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title"
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Page description (150-160 chars)"
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Keywords</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword1, keyword2, ..."
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Author</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author name"
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Canonical URL</label>
              <input type="text" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="https://..."
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Robots</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)}
                className="w-full rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1.5 text-sm">
                <option>index, follow</option>
                <option>noindex, follow</option>
                <option>index, nofollow</option>
                <option>noindex, nofollow</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">OG Type</label>
              <select value={ogType} onChange={(e) => setOgType(e.target.value)}
                className="w-full rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1.5 text-sm">
                <option>website</option>
                <option>article</option>
                <option>product</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">Charset</label>
              <select value={charset} onChange={(e) => setCharset(e.target.value)}
                className="w-full rounded border border-[var(--border-primary)] bg-[var(--bg-tertiary)] px-2 py-1.5 text-sm">
                <option>UTF-8</option>
                <option>ISO-8859-1</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">OG Image URL</label>
            <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/image.png"
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Generated Meta Tags</h3>
            <CopyButton text={output} />
          </div>
          <pre className="whitespace-pre-wrap rounded bg-[var(--bg-tertiary)] p-3 font-mono text-xs text-[var(--text-primary)] select-all max-h-[500px] overflow-auto">{output}</pre>
        </div>
      </div>
    </div>
  );
}
