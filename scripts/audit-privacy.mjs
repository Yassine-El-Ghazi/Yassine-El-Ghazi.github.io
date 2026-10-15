import { execFileSync } from 'node:child_process';
import { readFile, readdir, lstat, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, relative, join, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { scanText, pathFindings, documentApproved } from './privacy-rules.mjs';

const git = args => execFileSync('git', args, { maxBuffer: 64 * 1024 * 1024 });
const policy = JSON.parse(await readFile(new URL('../publication-policy.json', import.meta.url), 'utf8'));
const binaryTypes = new Set(['.png','.jpg','.jpeg','.webp','.gif','.avif','.ico','.woff','.woff2','.ttf','.otf','.pdf']);
const images = new Set(['.png','.jpg','.jpeg','.webp','.gif','.avif','.ico']);

export async function inspectBytes(bytes, path, { deployed = false, metadata = true } = {}) {
  const findings = pathFindings(path, { deployed, approvedDocument: documentApproved(deployed ? `public/${path}` : path, bytes, policy.reviewedDocuments) });
  const suffix = extname(path).toLowerCase();
  if (!binaryTypes.has(suffix)) findings.push(...scanText(bytes.toString('utf8'), path));
  if (metadata && (images.has(suffix) || suffix === '.pdf')) {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-metadata-'));
    const file = join(directory, 'asset' + suffix);
    try {
      await writeFile(file, bytes);
      const tags = JSON.parse(execFileSync('exiftool', ['-json','-G1','-s',file], {stdio:['ignore','pipe','pipe']}))[0];
      if (Object.keys(tags).some(tag=>/(?:^|:)(?:Error|Warning)$/.test(tag))) throw new Error('Invalid asset metadata');
      const mime = tags['File:MIMEType'];
      if (images.has(suffix) && !String(mime).startsWith('image/')) throw new Error('Image content mismatch');
      if (suffix === '.pdf' && mime !== 'application/pdf') throw new Error('Document content mismatch');
      for (const [tag, value] of Object.entries(tags)) {
        if (typeof value === 'string' && !tag.startsWith('System:') && tag !== 'SourceFile') findings.push(...scanText(value,path));
        if (/\b(?:GPS|Location|OwnerName|Artist|Author|Creator|LastModifiedBy|UserComment|Comment|Description|DocumentName|Title|Subject|Keywords|XP\w+)$/i.test(tag) || /GPS|SerialNumber|Location|DirectoryName/i.test(tag)) {
          if (value) findings.push({ rule:'sensitive-metadata',path,line:0 });
        }
      }
      if (suffix === '.pdf') {
        const text = execFileSync('pdftotext', ['-enc','UTF-8',file,'-'], {stdio:['ignore','pipe','pipe']}).toString();
        findings.push(...scanText(text,path));
        const info = execFileSync('pdfinfo', [file], {stdio:['ignore','pipe','pipe']}).toString();
        findings.push(...scanText(info,path));
      }
    } catch { findings.push({rule:'metadata-inspection-failed',path,line:0}); }
    finally { await rm(directory,{recursive:true,force:true}); }
  }
  return findings;
}

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, {withFileTypes:true})) {
    const path = join(directory,entry.name);
    if (entry.isDirectory()) result.push(...await walk(path));
    else result.push(path);
  }
  return result;
}

export async function audit({ history = false, dist = false } = {}) {
  const findings = [];
  let examined = 0;
  if (history) {
    const commits = git(['rev-list','--all']).toString().trim().split('\n').filter(Boolean);
    const seen = new Set();
    for (const commit of commits) {
      findings.push(...scanText(git(['show','-s','--format=%B',commit]).toString(),'commit-message'));
      for (const entry of git(['ls-tree','-rz',commit]).toString().split('\0').filter(Boolean)) {
        const [meta,path] = entry.split('\t');
        const [mode,type,oid] = meta.split(' ');
        const identity = oid + ':' + path;
        if (seen.has(identity)) continue;
        seen.add(identity);
        if (mode === '120000' || type !== 'blob') {findings.push({rule:'symlink-or-submodule',path,line:0});continue;}
        findings.push(...await inspectBytes(git(['cat-file','blob',oid]),path));
        examined++;
      }
    }
  } else {
    for (const path of git(['ls-files','-z','--cached','--others','--exclude-standard']).toString().split('\0').filter(Boolean)) {
      let info;
      try { info = await lstat(path); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      if (!info.isFile()) { findings.push({rule:'symlink-or-nonregular',path,line:0}); continue; }
      findings.push(...await inspectBytes(await readFile(path),path));
      examined++;
    }
  }
  if (dist) {
    const root = resolve('dist');
    for (const file of await walk(root)) {
      const path = relative(root,file);
      const info = await lstat(file);
      if (!info.isFile()) {findings.push({rule:'symlink-or-nonregular',path,line:0});continue;}
      findings.push(...await inspectBytes(await readFile(file),path,{deployed:true}));
      if (/\.html$/i.test(path)) {
        const html = await readFile(file,'utf8');
        if (/\b(?:href|src)\s*=\s*["'][^"']*(?:\.pdf|resume|curriculum|(?:^|[-/])cv(?:[-/.]|$))/i.test(html) || /\b(?:resume|résumé|curriculum vitae)\b/i.test(html.replace(/<[^>]+>/g,' '))) findings.push({rule:'removed-document-ui',path,line:0});
      }
      examined++;
    }
  }
  return { findings:[...new Map(findings.map(f=>[JSON.stringify(f),f])).values()], examined };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const {findings,examined} = await audit({history:process.argv.includes('--history'),dist:process.argv.includes('--dist')});
    if (findings.length) {
      for (const f of findings) console.error(`${JSON.stringify(f.path)}:${f.line} [${f.rule}] review required`);
      process.exitCode = 1;
    } else console.log(`Privacy audit passed: ${examined} file versions; paths, content and binary metadata checked.`);
  } catch { console.error('Privacy audit failed to complete; no source content was logged.'); process.exitCode = 1; }
}
