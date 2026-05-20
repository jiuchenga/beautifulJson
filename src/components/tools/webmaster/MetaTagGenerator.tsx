// src/components/tools/webmaster/MetaTagGenerator.tsx
import { useState } from 'react';
import CopyButton from '@/components/ui/CopyButton';
import { useToolI18n } from '@/lib/react-i18n';
import { StyledSelect } from '@/components/tools/shared/OptionBar';

export default function MetaTagGenerator({ title: toolTitle, description: toolDesc, lang }: { title?: string; description?: string; lang?: string } = {}) {
  const t = useToolI18n(lang);
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

  const output = `<!-- ${t.primaryMetaTags} -->
<meta charset="${charset}">
<meta name="viewport" content="${viewport}">
<meta name="title" content="${title}">
<meta name="description" content="${description}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}
<meta name="robots" content="${robots}">

<!-- ${t.openGraphFacebook} -->
<meta property="og:type" content="${ogType}">
${title ? `<meta property="og:title" content="${title}">` : ''}
${description ? `<meta property="og:description" content="${description}">` : ''}
${ogImage ? `<meta property="og:image" content="${ogImage}">` : ''}

<!-- ${t.twitterMeta} -->
<meta name="twitter:card" content="summary_large_image">
${title ? `<meta name="twitter:title" content="${title}">` : ''}
${description ? `<meta name="twitter:description" content="${description}">` : ''}
${ogImage ? `<meta name="twitter:image" content="${ogImage}">` : ''}
${canonical ? `\n<!-- ${t.canonicalMeta} -->\n<link rel="canonical" href="${canonical}">` : ''}`.replace(/\n{3,}/g, '\n\n');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{toolTitle ?? 'Meta Tag Generator'}</h1>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">{toolDesc ?? 'Generate HTML meta tags for SEO, Open Graph, and Twitter Cards.'}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.title}</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t.phPageTitle}
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.description}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t.phPageDesc}
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.keywords}</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="keyword1, keyword2, ..."
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.author}</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={t.phAuthor}
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.canonical}</label>
              <input type="text" value={canonical} onChange={(e) => setCanonical(e.target.value)} placeholder="https://..."
                className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.robots}</label>
              <StyledSelect value={robots} onChange={(e) => setRobots(e.target.value)} className="w-full">
                <option>index, follow</option>
                <option>noindex, follow</option>
                <option>index, nofollow</option>
                <option>noindex, nofollow</option>
              </StyledSelect>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.ogType}</label>
              <StyledSelect value={ogType} onChange={(e) => setOgType(e.target.value)} className="w-full">
                <option>website</option>
                <option>article</option>
                <option>product</option>
              </StyledSelect>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.charset}</label>
              <StyledSelect value={charset} onChange={(e) => setCharset(e.target.value)} className="w-full">
                <option>UTF-8</option>
                <option>ISO-8859-1</option>
              </StyledSelect>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-[var(--text-secondary)]">{t.ogImageUrl}</label>
            <input type="text" value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://example.com/image.png"
              className="w-full rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent-blue)]" />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-primary)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">{t.generatedMetaTags}</h3>
            <CopyButton text={output} lang={lang} />
          </div>
          <pre className="whitespace-pre-wrap rounded bg-[var(--bg-tertiary)] p-3 font-mono text-xs text-[var(--text-primary)] select-all max-h-[500px] overflow-auto">{output}</pre>
        </div>
      </div>
    </div>
  );
}
