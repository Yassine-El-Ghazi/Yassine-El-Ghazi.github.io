import { spawnSync, execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, lstatSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

// Never forward scanner stdout/stderr or report fields containing matched content.
const scratch = mkdtempSync(join(tmpdir(), 'portfolio-secrets-'));
let failed = false;
try {
  // Gitleaks also auto-loads source/.gitleaksignore even with an explicit ignore-path.
  // Reject suppression files in both the checkout and the index before either scan.
  const tracked = execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean);
  let hasIgnore = tracked.includes('.gitleaksignore');
  try { lstatSync('.gitleaksignore'); hasIgnore = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (hasIgnore) {
    console.error('Gitleaks suppression files are prohibited; remove .gitleaksignore and retry.');
    failed = true;
  }
  if (failed) throw new Error('Suppression policy');
  const version = spawnSync('gitleaks',['version'],{encoding:'utf8'});
  if (version.status !== 0) throw new Error('Gitleaks unavailable');
  const snapshot = join(scratch,'tracked');
  const emptyIgnore = join(scratch,'empty-ignore');
  writeFileSync(emptyIgnore,'');
  mkdirSync(snapshot);
  for (const path of tracked) {
    const destination = join(snapshot,path);
    mkdirSync(dirname(destination),{recursive:true});
    // Read index entries instead of an untracked or ignored working directory.
    writeFileSync(destination,execFileSync('git',['show',`:${path}`],{maxBuffer:64*1024*1024}));
  }
  for (const [mode,target,extra] of [['git','.', ['--log-opts=--all']], ['dir',snapshot,[]]]) {
    const report = join(scratch,mode+'.json');
    const result = spawnSync('gitleaks',[mode,target,...extra,'--redact=100','--no-banner','--no-color','--log-level=error','--ignore-gitleaks-allow',`--gitleaks-ignore-path=${emptyIgnore}`,'--config=.gitleaks.toml','--report-format=json',`--report-path=${report}`],{encoding:'utf8'});
    if (![0,1].includes(result.status)) throw new Error('Scanner execution failed');
    const findings = JSON.parse(readFileSync(report,'utf8'));
    for (const f of findings) {
      const path = f.File.startsWith(snapshot+'/') ? f.File.slice(snapshot.length+1) : f.File;
      console.error(`${JSON.stringify(path)}:${Number(f.StartLine)} [${String(f.RuleID).replace(/[^a-z0-9_-]/gi,'')}] potential secret`);
    }
    if (result.status !== 0 || findings.length) failed = true;
  }
  if (!failed) console.log('Gitleaks passed: all reachable Git history and tracked source snapshot.');
} catch { if (!failed) console.error('Secret scanning could not complete. Install the pinned Gitleaks CLI; no matched content was logged.'); failed = true; }
finally { rmSync(scratch,{recursive:true,force:true}); }
if (failed) process.exitCode = 1;
