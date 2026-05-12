// src/lib/seo.ts
export interface SEOProps {
  title: string;
  description: string;
  path: string;
  siteUrl: string;
  lang: string;
  toolName?: string;
  toolDescription?: string;
  faq?: Array<{ question: string; answer: string }>;
  steps?: Array<{ name: string; text: string }>;
  category?: string;
}

export function generateWebApplicationSchema(props: SEOProps): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: props.toolName || props.title,
    description: props.toolDescription || props.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };
}

export function generateFAQSchema(faq: Array<{ question: string; answer: string }>): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateHowToSchema(
  name: string,
  steps: Array<{ name: string; text: string }>
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    step: steps.map((step) => ({
      '@type': 'HowToStep',
      name: step.name,
      text: step.text,
    })),
  };
}

export function generateHreflangTags(
  path: string,
  siteUrl: string,
  langs: string[] = ['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'pt', 'ru', 'ar', 'hi', 'zh-tw']
): Array<{ lang: string; href: string }> {
  const tags = langs.map((lang) => ({
    lang,
    href: `${siteUrl}/${lang}${path}`,
  }));
  tags.push({ lang: 'x-default', href: `${siteUrl}/en${path}` });
  return tags;
}

export function buildMetaTags(props: SEOProps): {
  title: string;
  description: string;
  canonical: string;
  og: { title: string; description: string; url: string; type: string; siteName: string };
  twitter: { card: string; title: string; description: string };
} {
  const fullTitle = props.toolName
    ? `${props.toolName} - DevToolkit`
    : `${props.title} - DevToolkit`;
  return {
    title: fullTitle,
    description: props.description,
    canonical: `${props.siteUrl}/${props.lang}${props.path}`,
    og: {
      title: fullTitle,
      description: props.description,
      url: `${props.siteUrl}/${props.lang}${props.path}`,
      type: 'website',
      siteName: 'DevToolkit',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: props.description,
    },
  };
}
