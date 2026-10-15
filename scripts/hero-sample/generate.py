#!/usr/bin/env python3
"""Regenerate src/data/hero-sample.json from scripts/hero-sample/sample.c.

The hero shows a REAL compiled function: sample.c is compiled with gcc, disassembled with objdump,
and split into basic blocks here. Nothing in the output is hand-written. Run from the repository root:

    python3 scripts/hero-sample/generate.py

Requires gcc, objdump and readelf (binutils). The generated JSON is committed so the site build
does not need a compiler.
"""
import json, re, subprocess, tempfile, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(ROOT, 'sample.c')
OUT = os.path.join(ROOT, '..', '..', 'src', 'data', 'hero-sample.json')
FLAGS = ['-O1', '-fno-pie', '-no-pie', '-fcf-protection=none', '-fno-asynchronous-unwind-tables']
FUNC = 'verify'

def run(*cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout

tmp = tempfile.mkdtemp()
binary = os.path.join(tmp, 'sample')
run('gcc', *FLAGS, '-o', binary, SRC)
gcc_version = run('gcc', '--version').splitlines()[0]

dis = run('objdump', '-d', '-M', 'intel', '--insn-width=8', binary)
body = re.search(r'<%s>:\n(.*?)\n\n' % FUNC, dis, re.S).group(1)
rows = []
for line in body.splitlines():
    m = re.match(r'\s*([0-9a-f]+):\t((?:[0-9a-f]{2} )+)\s*\t(\S+)\s*(.*)$', line)
    if not m: continue
    addr, raw, mn, ops = m.group(1), m.group(2).split(), m.group(3), m.group(4).strip()
    ops = re.sub(r'\s*<[^>]*>', '', ops)
    rows.append({'addr': addr, 'bytes': ' '.join(b.upper() for b in raw), 'mn': mn, 'ops': ops})

start = int(rows[0]['addr'], 16)
BRANCH = re.compile(r'^(j[a-z]+)$')
for r in rows:
    r['branch'] = bool(BRANCH.match(r['mn']))
    r['cond'] = r['branch'] and r['mn'] != 'jmp'
    r['ret'] = r['mn'] == 'ret'
    r['target'] = r['ops'] if r['branch'] else None
    r['size'] = len(r['bytes'].split())

addrs = [r['addr'] for r in rows]
leaders = {rows[0]['addr']}
for i, r in enumerate(rows):
    if r['target'] in addrs: leaders.add(r['target'])
    if (r['branch'] or r['ret']) and i + 1 < len(rows): leaders.add(rows[i + 1]['addr'])

blocks, cur = [], None
for i, r in enumerate(rows):
    if r['addr'] in leaders:
        cur = {'id': len(blocks), 'label': ('sub_' if not blocks else 'loc_') + r['addr'], 'start': r['addr'], 'first': i, 'last': i}
        blocks.append(cur)
    cur['last'] = i
    r['block'] = cur['id']
by_start = {b['start']: b['id'] for b in blocks}

edges = []
for b in blocks:
    last = rows[b['last']]
    nxt = rows[b['last'] + 1]['addr'] if b['last'] + 1 < len(rows) else None
    if last['branch']:
        t = by_start[last['target']]
        edges.append({'from': b['id'], 'to': t, 'kind': 'loop' if t == b['id'] else ('taken' if last['cond'] else 'jump')})
        if last['cond'] and nxt: edges.append({'from': b['id'], 'to': by_start[nxt], 'kind': 'fall'})
    elif not last['ret'] and nxt:
        edges.append({'from': b['id'], 'to': by_start[nxt], 'kind': 'fall'})

# jump arrows for the listing gutter (row indices)
idx = {r['addr']: i for i, r in enumerate(rows)}
arrows = [{'from': i, 'to': idx[r['target']], 'kind': 'jump' if not r['cond'] else 'cond'} for i, r in enumerate(rows) if r['branch']]

# xrefs: which branch addresses reach each leader
xrefs = {}
for r in rows:
    if r['branch']: xrefs.setdefault(r['target'], []).append(r['addr'])
for r in rows: r['xrefs'] = xrefs.get(r['addr'], [])

sections = []
for line in run('readelf', '-S', '-W', binary).splitlines():
    m = re.match(r'\s*\[\s*\d+\]\s+(\.(?:text|rodata|data|bss))\s+\S+\s+([0-9a-f]+)\s+[0-9a-f]+\s+([0-9a-f]+)\s+\S+\s+(\S*)', line)
    if m: sections.append({'name': m.group(1), 'addr': m.group(2)[-6:], 'size': m.group(3).lstrip('0') or '0', 'flags': m.group(4)})

header = open(binary, 'rb').read(16)
with open(binary, 'rb') as f: data = f.read()
text_off = 0x1000 + (start - 0x401000)
func_bytes = sum(r['size'] for r in rows)

out = {
    'file': {'format': 'ELF64', 'arch': 'x86-64', 'compiler': gcc_version.split(')')[-1].strip() and gcc_version, 'flags': ' '.join(FLAGS), 'entry': re.search(r'Entry point address:\s+(0x[0-9a-f]+)', run('readelf', '-h', binary)).group(1)},
    'function': {'symbol': FUNC, 'name': 'sub_' + rows[0]['addr'], 'start': rows[0]['addr'], 'bytes': func_bytes, 'fileOffset': hex(text_off)},
    'rows': rows, 'blocks': blocks, 'edges': edges, 'arrows': arrows, 'sections': sections,
    'elfHeader': ' '.join('%02x' % b for b in header),
    'source': open(SRC).read().splitlines(),
}
with open(OUT, 'w') as f: json.dump(out, f, indent=1)
print('wrote', os.path.normpath(OUT), '|', len(rows), 'instructions,', len(blocks), 'blocks,', len(edges), 'edges')
