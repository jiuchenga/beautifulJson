// src/lib/format-utils.ts
import jsBeautify from 'js-beautify';
const { js_beautify, css_beautify, html_beautify } = jsBeautify as any;
import { format as sqlFormat } from 'sql-formatter';

// === JS Format & Compress ===

export function jsFormat(code: string): string {
  return js_beautify(code, { indent_size: 2, space_in_empty_paren: true });
}

export function jsCompress(code: string): string {
  // Protect string literals from regex damage
  const strings: string[] = [];
  let result = code.replace(/(["'`])(?:(?!\1|\\).|\\.)*\1/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });

  // Remove single-line comments (but not URLs with //)
  result = result.replace(/([^:]|^)\/\/.*$/gm, '$1');
  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Collapse multiple spaces/newlines
  result = result.replace(/\s+/g, ' ');
  // Remove spaces around operators and punctuation
  result = result.replace(/\s*([{}();,=+\-*/<>!&|?:])\s*/g, '$1');

  // Restore string literals
  result = result.replace(/__STR(\d+)__/g, (_, i) => strings[parseInt(i)]);
  return result.trim();
}

// === CSS Format & Compress ===

export function cssFormat(code: string): string {
  return css_beautify(code, { indent_size: 2 });
}

export function cssCompress(code: string): string {
  let result = code;
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  result = result.replace(/\s+/g, ' ');
  result = result.replace(/\s*([{}:;,])\s*/g, '$1');
  result = result.replace(/;\}/g, '}');
  return result.trim();
}

// === HTML Format & Compress ===

export function htmlFormat(code: string): string {
  return html_beautify(code, { indent_size: 2, wrap_line_length: 120 });
}

export function htmlCompress(code: string): string {
  let result = code;
  result = result.replace(/<!--[\s\S]*?-->/g, '');
  // Preserve whitespace between inline elements (not block-level tags)
  result = result.replace(/>\s+</g, (match, offset) => {
    // Check if surrounding tags are inline elements
    const inlineTags = /^(a|span|b|i|em|strong|small|sub|sup|abbr|code|time|mark)/i;
    const afterClose = result.slice(offset + 1).trimStart();
    return inlineTags.test(afterClose) ? match : '><';
  });
  result = result.replace(/\s+/g, ' ');
  result = result.trim();
  return result;
}

// === XML Format & Compress ===

export function xmlFormat(xml: string): string {
  let formatted = '';
  let indent = '';
  const tab = '  ';
  // Simple XML formatter - split on tag boundaries
  const tokens = xml.replace(/>\s*</g, '><').split(/(<[^>]+>)/g).filter(Boolean);
  for (const token of tokens) {
    if (!token.startsWith('<')) {
      // Text content
      formatted += indent + token.trim() + '\n';
      continue;
    }
    const isClosing = /^<\//.test(token);
    const isSelfClosing = /\/\s*>$/.test(token);
    if (isClosing) {
      indent = indent.substring(tab.length);
    }
    formatted += indent + token + '\n';
    if (!isClosing && !isSelfClosing && !/^<\?|^<!/.test(token)) {
      indent += tab;
    }
  }
  return formatted.trimEnd();
}

export function xmlCompress(xml: string): string {
  return xml.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
}

// === SQL Format & Compress ===

export function sqlFormatCode(code: string): string {
  return sqlFormat(code, { tabWidth: 2 });
}

export function sqlCompress(code: string): string {
  return code.replace(/\s+/g, ' ').replace(/\s*([(),;])\s*/g, '$1').trim();
}

// === Regex Utilities ===

export interface RegexMatch {
  match: string;
  index: number;
  groups: string[];
}

export function regexTest(pattern: string, flags: string, text: string): RegexMatch[] {
  const regex = new RegExp(pattern, flags);
  const results: RegexMatch[] = [];
  let match: RegExpExecArray | null;
  // Prevent infinite loops for zero-length matches
  let lastIndex = -1;
  while ((match = regex.exec(text)) !== null) {
    if (match.index === lastIndex) {
      regex.lastIndex++;
      continue;
    }
    lastIndex = match.index;
    results.push({
      match: match[0],
      index: match.index,
      groups: Array.from(match).slice(1),
    });
    if (!flags.includes('g')) break;
  }
  return results;
}

export function generateRegexCode(pattern: string, flags: string, language: string): string {
  // Escape pattern for target language string contexts
  const escDQ = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const escSQ = (s: string) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const escPHP = (s: string) => s.replace(/\\/g, '\\\\').replace(/\//g, '\\/');
  const pyFlags: string[] = [];
  if (flags.includes('i')) pyFlags.push('re.IGNORECASE');
  if (flags.includes('m')) pyFlags.push('re.MULTILINE');
  if (flags.includes('s')) pyFlags.push('re.DOTALL');

  switch (language) {
    case 'javascript':
      return `const regex = /${pattern}/${flags};\nconst matches = str.match(regex);`;
    case 'python':
      return `import re\npattern = r'${escSQ(pattern)}'\nmatches = re.findall(pattern, text${pyFlags.length ? ', ' + pyFlags.join(' | ') : ''})`;
    case 'java':
      return `Pattern pattern = Pattern.compile("${escDQ(pattern)}"${flags.includes('i') ? ', Pattern.CASE_INSENSITIVE' : ''});\nMatcher matcher = pattern.matcher(text);\nwhile (matcher.find()) {\n    System.out.println(matcher.group());\n}`;
    case 'go':
      return `re := regexp.MustCompile(\`${pattern}\`)\nmatches := re.FindAllString(text, -1)`;
    case 'php':
      return `preg_match_all('/${escPHP(pattern)}/${flags}/', $text, $matches);`;
    case 'ruby':
      return `matches = text.scan(/${pattern}/${flags})`;
    default:
      return `// Language not supported: ${language}`;
  }
}
