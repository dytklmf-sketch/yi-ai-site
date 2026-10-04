---
lang: en
pairKey: infrastructure-responsibilities
title: Splitting data-center responsibilities
description: 'Hardware, access, backups and exit: who owns each.'
service: infrastructure
updatedAt: '2026-09-19'
order: 6
sources:
  - label: Google Cloud shared responsibilities and shared fate
    url: https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate
---

## The short answer

Owning a data center does not automatically mean deployment, operations and backups are included. Before cooperation, identify **who provides, operates, approves and handles incidents** at each layer. Keep unresolved items visibly pending.

This is a discussion checklist, not Easy AI's service commitment or contractual terms. The official shared-responsibility reference explains a way to think about ownership; it does not replace a project-specific agreement.

## When this applies

Use it when discussing infrastructure resources, application environments or related cooperation. Buyers, application owners and technical leads should review it together so a task does not fall between assumed responsibilities.

## Define ownership by layer

1. **Physical resources:** Equipment ownership, permitted use, installation or removal arrangements and failed-hardware handling.
2. **Networks and systems:** Execution and approval of network changes, system installation, patches, access controls and administrative permissions.
3. **Applications and data:** Releases, dependency updates, data classification, routine operations and verification of results.
4. **Monitoring and incidents:** Detection, contact paths, evidence collection and escalation. Response times require separate agreement.
5. **Backup and recovery:** Covered material, frequency, storage location, recovery owner and validation method.
6. **Exit:** Resource release, data export or deletion, account revocation, outstanding charges and handover records.

For each item, record an accountable role, operating scope, required permissions, handover evidence and open questions. A single phrase such as “operations included” is not enough to describe every layer.

## Changes and acceptance

Agree on verifiable acceptance items, records and approvers before starting. Before changing equipment, networking, access or scope, describe the impact and cost, then obtain confirmation from an authorized person.

Incident exercises and recovery validation require prior authorization and bounded scope to avoid disrupting real work. Verify any required SLA, certification evidence or location condition separately. Do not infer them from a general website description.

## Common questions

### Does having a backup guarantee recovery?

Do not assume so. Confirm whether it covers the required material, whether recovery conditions are met and who validates it. Recovery objectives are negotiation inputs, not commitments made by this page.

### Can a partner retain administrator access by default?

Access should be explicit. Agree on minimum necessary permissions, an approver, duration and revocation. An initial discussion needs a description, not credentials.

### Does Easy AI offer every service listed?

No. Self-built data-center resources are confirmed. External services, equipment capacity, deployment, operations, backups and response arrangements must each be confirmed.
