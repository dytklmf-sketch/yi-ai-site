---
lang: en
pairKey: infrastructure-requirements
title: How to describe infrastructure needs
description: Workload type, model size, duration and data location.
service: infrastructure
updatedAt: '2026-09-19'
order: 5
sources:
  - label: Google Cloud architecture framework on shared responsibilities
    url: https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate
---

## The short answer

Start with **what will run, which resources it needs, how it connects, how long it will run and who will manage it**. A hardware model is one discussion input, not a substitute for a workload description and operating boundary.

Easy AI owns self-built data-center resources. That does not establish availability of every configuration or a commitment to external rental or hosting. Equipment, capacity, location and cooperation scope require individual confirmation.

## When this applies

Use this checklist for an initial discussion involving technical teams, application owners or infrastructure partners. During an early validation stage, provide ranges, existing measurements and uncertainties rather than inventing a precise purchase quantity.

## Six groups of requirements

1. **Purpose:** Development, testing or business operation; continuous versus intermittent work and acceptable interruptions.
2. **Compute:** Required CPU, memory, accelerators and runtime conditions. Separate mandatory requirements from substitutable ones.
3. **Storage:** Current volume, growth range, access patterns, backup and recovery objectives.
4. **Network:** Users, connection direction, estimated bandwidth, fixed-address or isolation needs and approval owners.
5. **Timeline:** Start and end dates, validation window, possible expansion points and migration-out timing.
6. **Responsibilities:** Owners for equipment, systems, applications, accounts, logs and backups, plus incident contacts.

For sensitive information and access, describe classification and restrictions first. Do not send real business datasets or administrator passwords with an initial inquiry.

## Turn the brief into a discussion

Describe the existing environment and workload. Summarize available monitoring or test results as ranges. Label assumptions where measurements are unavailable; estimates are not guarantees.

Next, confirm resource matching, operating conditions and duration. Discuss pricing, validation and implementation only after availability and responsibilities are clear. The shared-responsibility reference helps frame questions; it does not imply that Easy AI offers those cloud services or holds related certifications.

## Common questions

### Can we ask for a specific hardware model?

Yes, but also provide purpose, quantity, runtime and acceptable alternatives. Availability must be checked; it cannot be inferred from ownership of a data center.

### What if we do not know exact usage?

Provide an estimated range, its basis and growth assumptions. Validation can be discussed, but resources, charges and arrangements require separate agreement.

### Does API access mean the model runs in this facility?

No. Model access channels and infrastructure are separate matters. Owning a data center does not establish where a third-party model is deployed.
