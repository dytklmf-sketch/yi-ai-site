---
lang: en
pairKey: infrastructure-responsibilities
title: Splitting data-center responsibilities
description: 'Hardware, access, backups and exit: who owns each.'
service: infrastructure
updatedAt: '2026-10-05'
order: 6
keyPoints:
  - 'Having data-center resources does not mean the provider deploys, operates and backs up everything; name who provides, operates and approves at each layer.'
  - 'Confirm every cell of a responsibility matrix; none stays open at signing.'
  - 'Agree data export and deletion at exit before cooperation starts.'
sources:
  - label: 'Google Cloud Architecture Framework: shared responsibility and shared fate'
    url: https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate
---

For teams preparing to discuss infrastructure resources, runtime environments or related cooperation. Buyers, application owners and technical leads should review it together so nobody assumes another party handles a task.

## Confirm responsibility by layer

1. **Physical resources**: equipment ownership, permitted use, site access and faulty-hardware handling.
2. **Network and systems**: who performs and approves network changes, OS installation, patches, access control and admin rights.
3. **Applications and data**: releases, dependency upgrades, data classification, daily operation and checking results.
4. **Monitoring and incidents**: who detects, whom they notify, what evidence is collected and when to escalate; response times agreed separately.
5. **Backup and recovery**: what is backed up, how often, where it is kept, who restores and how restores are verified.
6. **End of term**: releasing resources, exporting or deleting data, revoking accounts, outstanding fees and hand-over records.

For each item record the owner, scope, required permissions, hand-over evidence and open issues. Do not cover every layer with a single “handles operations”.

## A responsibility matrix

Put the six layers in one table with a single letter per cell: **D** (does it), **A** (approves), **I** (is informed). This illustrates how to fill it in; it is not Easy AI’s default split.

| Item                          | Resource provider | User | Note                                |
| ----------------------------- | ----------------- | ---- | ----------------------------------- |
| Replace failed hardware       | D                 | I    | Window agreed by both               |
| Change network policy         | D                 | A    | User requests, provider performs    |
| OS patching                   | Open              | Open | Depends on deployment form          |
| Release and roll back the app | I                 | D    |                                     |
| Classify and mask data        | —                 | D    | Provider does not see business data |
| Run backups                   | Open              | Open | State what and how often            |
| Restore drills                | D                 | A    | Authorised and scoped first         |
| Create and revoke accounts    | D                 | A    | Least privilege                     |
| Delete data at end of term    | D                 | A    | Keep a deletion record              |

The “Open” cells are exactly what needs negotiating. None should remain open at signing.

## Changes and acceptance

Agree verifiable acceptance items, records and approvers before starting. Changes to equipment, network, permissions or scope state their impact and cost and go ahead once an authorised person confirms.

Incident drills and recovery tests need prior authorization and a limited scope so real business is not affected. SLAs, certifications or location requirements must be verified separately, never assumed from a web page.

## Exit checklist

Ending cooperation causes more trouble than starting it. Attach this list to the agreement:

1. **Notice period**: how many days ahead renewal or exit is confirmed.
2. **Data export**: format, method, time needed and who checks completeness.
3. **Data deletion**: scope (including backups and logs), method and proof of deletion.
4. **Accounts and access**: when every account, key and allow-list entry is revoked.
5. **Final settlement**: how the last period is billed and whether early termination fees apply.
6. **Hand-over record**: configuration, documents and open issues, signed off by both sides.

## Four places the split goes wrong

- **One “handles operations” for everything**: hardware, system and application operations are three different jobs.
- **Assuming backups exist**: without stating what, how often and how to restore, there is no agreement.
- **Never revoking admin access**: temporary access needs an expiry date.
- **Discussing only the start**: exporting and deleting data at exit is where disputes arise.

## FAQ

### Does a backup guarantee recovery?

Do not assume so. Confirm coverage, recovery prerequisites and who verifies restoration. Recovery targets are negotiated conditions, not commitments on this page.

### May a partner keep admin access by default?

No. Define least-necessary permissions, approver, duration and revocation. The first discussion needs a description, not credentials.

### Does Easy AI provide every service listed?

No. Easy AI provides first-hand data-center resources; external services, capacity, deployment, operations, backup and response arrangements are confirmed case by case.

### Who drafts the matrix?

Either side can, as long as both confirm every cell. A good start is for the user to fill in a version with its own expectations.
