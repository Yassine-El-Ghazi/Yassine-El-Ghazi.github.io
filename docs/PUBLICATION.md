# Publication policy

Every technical claim should be supported by linked public source code, a reproducible demonstration, or an official competition result. Keep team achievements attributed to the team. Label demonstration artifacts as demonstrations, and describe limitations alongside results.

## Before publishing

- Publish only professional information intended for public viewing. The profile email and linked professional accounts are intentional contact information.
- Keep development notes, personal documents, credentials, environment files, recovery bundles, database dumps, configuration backups and temporary files outside this repository.
- Project skills must link to public evidence. Do not add unsupported claims or personal document downloads.
- Run `npm test`, `npm run check`, `npm run build`, `npm run audit:site`, `npm run audit:privacy`, `npm run audit:history` and `npm run audit:secrets`.

The privacy scanner checks all tracked source, working changes and generated assets. The history check visits every reachable commit tree, including unchanged files and binary metadata. Gitleaks checks all reachable history and an isolated snapshot of the Git index, using upstream detection rules without broad exclusions. Scanner logs contain only paths, line numbers and rule IDs, never matched values. Any finding requires review; scanners are safeguards, not proof that disclosure is impossible.

Install ExifTool and Poppler (`pdftotext`, `pdfinfo`) for binary inspection. Install Gitleaks **8.30.1** from its official release; CI verifies the Linux archive SHA-256 before extraction. Update the version and checksum together after reviewing upstream releases.

## Documents and media

Documents are denied by default. To propose a future public document, review its full text and metadata, remove personal information, then add its exact repository path, SHA-256 and a public review rationale of at least ten characters to `publication-policy.json` under `reviewedDocuments`. Review this policy change in a pull request. A changed document requires a new hash and review. Deployment does not bypass document review. Never approve a prohibited personal document.

Raster images are inspected by ExifTool for author, location, device identifiers, comments and descriptive metadata. Review and strip sensitive metadata before committing images. Future approved PDFs also pass text extraction and metadata checks. An unavailable inspector fails the scan.

Only `dist/` is uploaded to Pages, after privacy, history, secret, type and site checks succeed. CI uses read-only repository permissions; Pages and OIDC write permissions belong only to the deployment job. Third-party actions use immutable commit references. Fork pull requests do not deploy or receive deployment credentials.

## Security findings

Do not paste credentials or private document content into public issues or logs. Revoke any exposed credential at its provider, then remove it from current source and reachable history. History changes require a verified private backup, review of collaborators and references, explicit approval, and updates protected by the expected old ref values. Existing clones, cached views and server-managed references can require separate remediation.
