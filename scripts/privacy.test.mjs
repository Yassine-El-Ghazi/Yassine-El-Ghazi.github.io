import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { scanText, pathFindings, documentApproved } from './privacy-rules.mjs';

// Values are assembled synthetic fixtures, never working credentials.
const repeated = 'Ab9xZ7qM2vL6rT8nP4sK'.repeat(4);
const cases = [
  ['github', 'gh' + 'p_' + repeated.slice(0, 36)],
  ['github', 'github_' + 'pat_' + repeated],
  ['ai-key', 'sk-' + 'proj-' + repeated],
  ['ai-key', 'sk-' + 'ant-api03-' + repeated],
  ['ai-key', 'AI' + 'za' + repeated.slice(0, 35)],
  ['aws-key', 'AK' + 'IA' + 'Z7X2Q9M4N8P6R3T5'],
  ['cloudflare', 'CLOUDFLARE_API_TOKEN=' + repeated.slice(0,40)],
  ['supabase', 'sb_' + 'secret_' + repeated],
  ['payment-key', 'sk_' + 'live_' + repeated],
  ['payment-key', 'wh' + 'sec_' + repeated],
  ['database-url', 'postgresql://' + 'tester:' + repeated + '@db.example.invalid/app'],
  ['jwt', ['eyJ' + repeated, 'eyJ' + repeated, repeated].join('.')],
  ['private-key', '-----BEGIN ' + 'OPENSSH PRIVATE KEY-----'],
  ['private-key', '-----BEGIN ' + 'CERTIFICATE-----'],
  ['private-ip', [192,168,12,34].join('.')],
  ['private-ip', [172,19,12,34].join('.')],
  ['private-ip', [10,12,34,56].join('.')],
  ['phone', '+' + '212 612 345 678'],
  ['phone', '+' + '1 (202) 555-0199'],
  ['phone', ['06','12','34','56','78'].join(' ')],
  ['credential-assignment', JSON.stringify({ password: repeated })],
  ['credential-assignment', 'api_key: ' + repeated],
  ['credential-assignment', 'const token = "' + repeated + '"'],
  ['private-path', '/' + 'home/private-user/Documents/item'],
];
for (const [rule, content] of cases) test(`detect ${rule}: fixture ${cases.indexOf(cases.find(c=>c[1]===content))}`, () => {
  const findings = scanText(content, 'fixture.txt');
  assert.ok(findings.some(f => f.rule === rule), `missing ${rule}`);
  assert.ok(findings.every(f => Object.keys(f).sort().join(',') === 'line,path,rule'));
  assert.ok(!JSON.stringify(findings).includes(repeated));
});
for (const text of [
  'yassine.elghazi@eidia.ueuromed.org',
  'https://github.com/Yassine-El-Ghazi',
  'http://127.0.0.1:4321',
  'const token = process.env.API_TOKEN;',
  'password: "example-not-a-real-secret"',
  '2026-10-15 commit 0123456789abcdef',
  'const key = "ArrowDown";',
]) test(`allow public/non-secret example ${text.slice(0,22)}`, () => assert.deepEqual(scanText(text,'example.md'), []));
for (const path of ['PROGRESS.md','docs/CONTENT.md','public/Yassine-El-Ghazi-CV.pdf','.env','.env.production','public/.env.example','notes.bak','backup/dump.sql','db.sqlite','id_rsa','public/private.pem','output/recovery.bundle','public/temp.txt','public/unexpected.pdf','public/resume.txt']) {
  test(`block path ${path}`, () => assert.ok(pathFindings(path).length));
}
for (const path of ['src/data/profile.ts','docs/WRITEUPS.md','.github/workflows/deploy.yml','tests/example.test.mjs','.env.example','public/favicon.svg']) {
  test(`allow source ${path}`, () => assert.deepEqual(pathFindings(path), []));
}
test('future documents require exact path, hash and review note', () => {
  const bytes = Buffer.from('safe example');
  assert.equal(documentApproved('public/paper.pdf', bytes, []), false);
  assert.equal(documentApproved('public/paper.pdf', bytes, [{path:'public/paper.pdf',sha256:'wrong',review:'Reviewed'}]), false);
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  assert.equal(documentApproved('public/paper.pdf', bytes, [{path:'public/paper.pdf',sha256,review:'Text and metadata reviewed'}]), true);
});
test('prohibited PDF cannot be approved under a deployment-relative path', () => {
  assert.ok(pathFindings('Yassine-El-Ghazi-CV.pdf',{deployed:true,approvedDocument:true}).length);
});
