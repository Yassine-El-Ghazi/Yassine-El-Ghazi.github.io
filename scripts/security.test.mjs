import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { inspectBytes } from './audit-privacy.mjs';

test('metadata inspection fails closed for malformed images', async () => {
  const findings = await inspectBytes(Buffer.from('not an image'),'public/picture.png');
  assert.ok(findings.some(f=>f.rule==='metadata-inspection-failed'));
});
test('public document approval does not bypass private metadata or text scans', async () => {
  const findings = await inspectBytes(Buffer.from('not a PDF'),'public/paper.pdf');
  assert.ok(findings.some(f=>f.rule==='unreviewed-document'));
  assert.ok(findings.some(f=>f.rule==='metadata-inspection-failed'));
});
test('secret scanner catches deleted historical leaks and never echoes matched values', () => {
  const cwd = mkdtempSync(join(tmpdir(),'portfolio-synthetic-history-'));
  const git = args => execFileSync('git',args,{cwd,stdio:'pipe'});
  // Synthetic token with a provider-shaped prefix; never valid or sent to a provider.
  const token = 'gh' + 'p_' + 'Ab9xZ7qM2vL6rT8nP4sK'.repeat(2).slice(0,36);
  try {
    git(['init','-q']);
    git(['config','user.name','Example Test']);
    git(['config','user.email','test@example.invalid']);
    writeFileSync(join(cwd,'.gitleaks.toml'),'[extend]\nuseDefault = true\n');
    writeFileSync(join(cwd,'example.txt'),token);
    git(['add','.']); git(['commit','-qm','Synthetic fixture']);
    git(['rm','-q','example.txt']); git(['commit','-qm','Remove synthetic fixture']);
    const scan = () => spawnSync(process.execPath,[fileURLToPath(new URL('./audit-secrets.mjs',import.meta.url))],{cwd,encoding:'utf8'});
    const initial = scan();
    assert.equal(initial.status,1);
    assert.match(initial.stderr,/potential secret/);
    assert.ok(!initial.stdout.includes(token) && !initial.stderr.includes(token));
    const report = join(cwd,'synthetic-report.json');
    spawnSync('gitleaks',['git',cwd,'--redact=100','--report-format=json',`--report-path=${report}`],{cwd,encoding:'utf8'});
    const fingerprint = JSON.parse(readFileSync(report,'utf8'))[0].Fingerprint;
    rmSync(report);
    writeFileSync(join(cwd,'.gitleaksignore'),fingerprint+'\n');
    git(['add','.gitleaksignore']);git(['commit','-qm','Attempt to suppress historical fixture']);
    const result = scan();
    assert.equal(result.status,1);
    assert.match(result.stderr,/suppression files are prohibited/);
    assert.ok(!result.stdout.includes(token) && !result.stderr.includes(token));
    assert.ok(!result.stderr.includes('Synthetic fixture'));
    rmSync(join(cwd,'.gitleaksignore'));
    assert.equal(scan().status,1, 'suppression remains prohibited in the index when missing from the working tree');
  } finally {rmSync(cwd,{recursive:true,force:true});}
});
