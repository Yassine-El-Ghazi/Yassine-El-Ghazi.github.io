---
title: "Replace with the analysis title"
summary: "One or two sentences: what was analyzed and what was found."
date: 2026-01-01
category: reverse-engineering   # reverse-engineering | malware-analysis | vulnerability-research | ctf | tooling
target: "Name or hash of the binary or sample, if safe to publish"
arch: "x86-64"
format: "ELF64"
tools: ["Ghidra"]
tags: []
draft: true
---

This file starts with an underscore, so it is ignored by the content loader. Copy it to a new
`src/content/writeups/<slug>.md`, remove `draft: true`, and replace every placeholder with real material.
Do not publish live malware, working exploits against unpatched software, or anything covered by an NDA.

## Scope and safety

What was analyzed, in what environment, and what was deliberately not done.

## Triage

File type, headers, sections, imports, and strings that guided the analysis.

```text
00000000  7f 45 4c 46 02 01 01 00  |.ELF....|
```

## Static analysis

```asm
; paste a real listing from Ghidra / IDA / Binary Ninja
```

### Decompiled pseudocode

```c
// paste real decompiler output and explain what it does
```

## Findings

Observed behavior, with offsets, addresses, and screenshots.

## Limits

What this analysis does not show.
