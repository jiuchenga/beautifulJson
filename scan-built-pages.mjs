import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

const distDir = 'dist';
const languages = ['zh','zh-tw','ja','ko','fr','de','es','pt','ru','ar','hi'];

// Patterns that are OK to have in English (technical values, standard codes)
const allowedPatterns = [
  'UTF-8', 'ISO-8859-1', 'index, follow', 'noindex', 'nofollow',
  'JavaScript', 'Python', 'Java ', 'Go ', 'PHP ', 'Ruby ',
  'WiFi', 'SSID', 'vCard', 'QR Code', 'PNG', 'URL', 'Data URL',
  'SVG', 'WPA/WPA2', 'WEP', 'UTF-', 'Robots', 'Meta ',
  'OG ', 'User-agent', 'Disallow', 'Allow', 'Sitemap',
  'Canonical', 'devtoolkit', 'DevToolkit'
];

function getAllHtmlFiles(dir) {
  let results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (entry.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

// Check for English UI text in non-English pages
// Look for common hardcoded English words that would appear in visible UI
const englishPatterns = [
  />Current Time</, />Timestamp/, />Date →/, />Seconds:</, />Milliseconds:</,
  />ISO:</, />From</, />To</, />Value</, />Pattern</, />Flags</,
  />Test String</, />Match Highlight</, />Match Results</,
  />Raw JSON</, />Parsed Output</, />Type Analysis</,
  />Colorized Output</, />Original JSON</, />Modified JSON</,
  />Tree View</, />View Tree</, />Cron Expression</,
  />Decoded Content</, />Response Headers</, />Common Status Codes</,
  />Look Up</, />Generated Meta Tags</, />OG Image URL</,
  />Text Color</, />Preview</, />Content</, />Category:</,
  />Subnet Information</, />Browser</, />Mobile</, />Bot</,
  />Raw UA String</, />My UA</, />Data URL</,
  />Lap</, />Laps</, />Current</, />Start</, />Stop</, />Reset</,
  />Resume</, />Example: Email</, />Code</,
  />Enter regex/, />Enter text/, />Paste/,
  />IP Address/, />CIDR/, />Enter URL/,
  />Enter HTTP/, />Page title/, />Author name/,
  />Sitemap URL</, />User-Agent/,
  />Crawl Delay</, />robots.txt/,
  />Output</, />Input</, />Execute</, />Clear</, />Example</,
  />Download</, />Options</, />Format</, />Compress</,
  />Encrypt</, />Decrypt</, />Encode</, />Decode</,
  />Generate</, />Convert</, />Calculate</, />Check</,
  />Mode</, />Algorithm</, />Indent</, />Sort Keys</,
  />Language</, />Direction</, />Method</,
  />2 spaces</, />4 spaces</, />Tab</,
  />Password</, />Username</,
  />Length</, />Size/, />Color</, />Foreground</, />Background</,
  />Title</, />Description</, />Keywords</, />Author</,
  />Robots</, />Charset</, />Canonical</,
  />Sort Keys Label</, />Compare</, />Colorize</, />Parse</,
  />Test</, />View</, />Add</, />Remove</,
  />Swap Units</, />Use Current</,
  />Expand All</, />Collapse All</,
  />Start Date</, />End Date</, />Result</,
  />Temperature</, />Weight</, />Speed</, />Time</,
  />Data Storage</, />Angle</, />Energy</, />Power</,
  />Pressure</, />Density</, />Force</,
  />Area</, />Volume</, />Length</,
  />WiFi password/,
  />qrPreview</, />clickGenerate</,
];

let issues = 0;
const htmlFiles = getAllHtmlFiles(distDir);

for (const file of htmlFiles) {
  // Only check non-English pages
  const lang = file.replace('dist/', '').split('/')[0];
  if (!languages.includes(lang)) continue;
  
  const content = readFileSync(file, 'utf-8');
  
  for (const pattern of englishPatterns) {
    if (pattern.test(content)) {
      // Check if it's in a context that should be translated (visible UI, not code/URL)
      const matches = content.match(new RegExp(pattern.source, 'g'));
      if (matches) {
        for (const m of matches) {
          const text = m.replace(/^>/, '').replace(/<$/, '').trim();
          // Skip if it's an allowed technical term
          if (allowedPatterns.some(p => text.includes(p))) continue;
          console.log(`${file}: "${text}"`);
          issues++;
        }
      }
    }
  }
}

console.log(`\nTotal issues: ${issues}`);
