import { createHash } from 'node:crypto';

// Only rule IDs and locations leave this module. Never return a match or source line.
const rules = [
  ['github', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,})\b/g],
  ['ai-key', /\b(?:sk-(?:(?:proj|svcacct|ant-api\d+)-)?[A-Za-z0-9_-]{20,}|AIza[A-Za-z0-9_-]{30,}|hf_[A-Za-z0-9]{30,})\b/g],
  ['aws-key', /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g],
  ['cloudflare', /\b(?:CLOUDFLARE|CF)_(?:API_TOKEN|API_KEY)\s*[=:]\s*["']?[A-Za-z0-9_-]{30,}/gi],
  ['supabase', /\bsb_secret_[A-Za-z0-9_-]{20,}\b/g],
  ['payment-key', /\b(?:(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}|whsec_[A-Za-z0-9]{16,}|polar_[A-Za-z0-9_-]{20,})\b/g],
  ['database-url', /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis(?:s)?):\/\/[^\s/"'<>:]+:[^\s@"'<>]+@[^\s"'<>]+/gi],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g],
  ['private-key', /-----BEGIN (?:[A-Z0-9 ]*PRIVATE KEY|CERTIFICATE|PGP PRIVATE KEY BLOCK)-----/g],
  ['private-ip', /\b(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})\b/g],
  ['phone', /(?:\+\d[\d ().-]{7,}\d|\b0[567](?:[ .-]?\d){8}\b)/g],
  ['private-path', /(?:(?<![A-Za-z0-9_.\/-])\/(?:home|Users|run\/media|mnt|workspace)\/[^\s/"'<>]+\/|[A-Z]:\\Users\\[^\\\s]+\\)/g],
  ['credential-assignment', /["']?\b(?:password|passwd|pwd|api[_-]?key|api[_-]?token|access[_-]?token|refresh[_-]?token|client[_-]?secret|secret[_-]?key|database[_-]?password|token|secret)\b["']?\s*[:=]\s*["']?([^\s"'`,;}<>]{8,})/gi],
];
const placeholders = new Set(['example-not-a-real-secret', 'process.env.API_TOKEN']);
export function scanText(text, path) {
  const findings = [];
  for (const [rule, pattern] of rules) {
    pattern.lastIndex = 0;
    for (const match of text.matchAll(pattern)) {
      if (rule === 'credential-assignment' && (placeholders.has(match[1]) || /^(?:process\.env\.|import\.meta\.env\.|\$\{|\$\{\{)/.test(match[1]) || (!/["']/.test(match[0].slice(match[0].indexOf(match[1])-1,match[0].indexOf(match[1]))) && match[1].length < 16 && !/\d/.test(match[1])))) continue;
      if (rule === 'phone' && (match[0].replace(/\D/g,'').length < 9 || match[0].replace(/\D/g,'').length > 15)) continue;
      findings.push({ rule, path, line: text.slice(0, match.index).split('\n').length });
    }
  }
  return findings;
}

export const prohibitedPaths = ['PROGRESS.md', 'docs/CONTENT.md', 'public/Yassine-El-Ghazi-CV.pdf'];
export function pathFindings(path, { deployed = false, approvedDocument = false } = {}) {
  const p = path.replaceAll('\\','/');
  const base = p.split('/').at(-1);
  const result = [];
  const add = rule => result.push({rule,path,line:0});
  if (prohibitedPaths.some(x => p.toLowerCase() === x.toLowerCase()) || base.toLowerCase() === 'yassine-el-ghazi-cv.pdf' || /(?:^|\/)(?:cv|resume|résumé)(?:[-_.]|$)|(?:^|\/)PROGRESS\.md$/i.test(p)) add('prohibited-file');
  if (/(?:^|[-_. ])(?:cv|resume|résumé)(?:[-_. ]|$)/i.test(base) && /\.(?:pdf|docx?|txt|md|rtf)$/i.test(base)) add('personal-document');
  if (/(?:^|\/)(?:notes|internal[-_]notes|private[-_]notes|progress)(?:[-_.]|$)|(?:^|\/)docs\/superpowers\//i.test(p)) add('internal-record');
  if (/(?:^|\/)(?:\.npmrc|\.pypirc|\.netrc|\.pgpass|\.gitleaksignore|credentials\.json|service[-_]account\.json)$|(?:^|\/)(?:\.ssh|\.aws|\.kube)(?:\/|$)/i.test(p)) add('credential-config');
  if (/(?:^|\/)\.env(?:\..*)?$/i.test(p) && !(p === '.env.example' && !deployed)) add('environment-file');
  if (/(?:^|\/)(?:backups?|private|temp|tmp|output|\.git|node_modules|\.cache)(?:\/|$)|(?:\.(?:bak|backup|old|orig|swp|swo|tmp|temp|log|sql|sqlite3?|db|dump|bundle|zip|tar|gz|7z|p12|pfx|pem|key)|~)$/i.test(p) || /(?:^|\/)id_(?:rsa|ed25519|ecdsa)(?:\.pub)?$/i.test(p)) add('private-or-backup-file');
  if (/\.(?:pdf|docx?|xlsx?|pptx?|odt|ods|rtf)$/i.test(p) && !approvedDocument) add('unreviewed-document');
  if ((deployed || p.startsWith('public/')) && !/\.(?:html|css|js|mjs|json|xml|txt|svg|png|jpe?g|webp|gif|avif|ico|woff2?|ttf|otf|pdf)$/i.test(p) && base !== '.nojekyll') add('unexpected-public-asset');
  if ((deployed || p.startsWith('public/')) && /(?:^|\/)(?:temp|draft|notes?|config|credentials?|secrets?)(?:[-_.]|$)/i.test(p)) add('internal-public-file');
  return result;
}
export function documentApproved(path, bytes, reviews) {
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  return reviews.some(r => r.path === path && r.sha256 === sha256 && typeof r.review === 'string' && r.review.trim().length >= 10);
}
export function documentUiFindings(html,path) {
  const linked = /\b(?:href|src)\s*=\s*["'][^"']*(?:resume|curriculum|(?:^|[-/])cv(?:[-/.]|$))/i.test(html);
  const label = /\b(?:cv|resume|résumé|curriculum vitae)\b/i.test(html.replace(/<[^>]+>/g,' '));
  return linked || label ? [{rule:'removed-document-ui',path,line:0}] : [];
}
