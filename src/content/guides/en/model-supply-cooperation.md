---
lang: en
pairKey: model-supply-cooperation
title: What to bring to a model supply discussion
description: Resource scope, supply rights, interfaces and settlement.
service: model-services
updatedAt: '2026-10-05'
order: 4
keyPoints:
  - 'Bring a verifiable resource description and responsibility list, not just a price.'
  - 'Test with separate credentials and approved samples; never pass production keys in chats or documents.'
  - 'Agree reconciliation, billing of failed requests and exit before starting.'
  - 'Easy AI works with direct supply channels, not supply straight from model vendors.'
sources:
  - label: 'Google Gemini API: rate limits'
    url: https://ai.google.dev/gemini-api/docs/rate-limits
  - label: 'Google Gemini API: tokens'
    url: https://ai.google.dev/gemini-api/docs/tokens
---

For supply partners entitled to provide the resources and able to explain the scope, and for buyers building a verification process. If supply rights, permissions or data responsibilities are unclear, verify them first; a small paid test is not a substitute for authorization.

## Six items for a first conversation

1. **Roles**: the contact and their remit; whether the resource holder and the actual service provider are the same party.
2. **Resource scope**: model identifiers, interface, input/output types, service region and supply period; mark anything unconfirmed.
3. **Supply basis**: verifiable rights to use and supply, and which documents can be checked under suitable confidentiality.
4. **Capacity limits**: request rate, token limits, concurrency and planned maintenance windows — described by condition, not one total.
5. **Billing and settlement**: units, cycle, a reconciliation sample, dispute handling and how price changes are notified.
6. **Responsibility and exit**: incident contact, data and log handling, suspension conditions, unfinished jobs and remaining balance.

The official rate-limit reference explains the difference between a total quota and per-unit-time limits, but actual supply limits must come from the real provider.

## A sample resource description

A fictional description showing how much detail each field needs. Model names and figures are placeholders, not a real offer.

| Field                   | Example                                                |
| ----------------------- | ------------------------------------------------------ |
| Model ID                | 〈model name〉, version 〈date or number〉             |
| Interface               | OpenAI-compatible Chat Completions with streaming      |
| Input / output          | Text in, text out; no image input                      |
| Context / output limit  | Per the official model page, with a link               |
| Capacity                | 〈n〉 requests/min, 〈n〉 tokens/min, 〈n〉 concurrent |
| Maintenance             | Weekly 〈window〉, 〈n〉 days’ notice                  |
| Supply period           | 〈start〉 to 〈end〉, renewal conditions 〈…〉         |
| Metering and settlement | Usage fields in responses, reconciled monthly          |
| Incident contact        | Weekdays 〈hours〉, 〈role〉                           |
| Supply basis            | Documents verifiable under confidentiality             |

The supplier fills in the bracketed items from fact; write “open” instead of guessing.

## Validation and next steps

1. **Check identity and basis**: contact, resource holder and supply rights.
2. **Agree a limited test**: goal, sample, cost, data scope and call rate.
3. **Run the test**: approved samples and separate test credentials only; never pass production keys in chats or documents.
4. **Summarise**: compatibility, error types, latency and metering differences, marking what is resolved and what is open.
5. **Agree formal terms**: volume, settlement cycle, price changes, suspension and exit.

A successful test does not by itself establish long-term capacity or response commitments.

## Reconciliation

Most supply disputes are about metering. Keep records this way from day one:

- **Both sides record**: the buyer logs the usage fields returned per request; the supplier logs from its own metering; both total by day.
- **Agree the granularity**: daily totals per model for input, output and cached tokens; check line by line when the gap exceeds an agreed percentage.
- **Failed requests**: decide before starting whether timeouts, errors and cancellations are billed.
- **Price changes**: notice period, effective date and what happens to prepaid balances at the old price.

Run one reconciliation during the test to make sure both sides’ numbers match before formal cooperation.

## Four common problems in supply deals

- **Quoting one total quota**: monthly totals, per-minute limits and concurrency are separate constraints.
- **Supplying through personal accounts or keys of unknown origin**: resources without a verifiable basis do not suit long-term cooperation, however cheap.
- **Testing with production keys**: use separate credentials with limited scope and expiry.
- **No exit terms**: agree up front how remaining balance, unfinished jobs and logs are handled at the end.

## FAQ

### Is the lowest price enough to start cooperating?

No. Supply basis, available scope, responsibilities and settlement terms must also be confirmed before options can be compared.

### Do you require supply directly from the model vendor?

Channel roles must be stated truthfully. Easy AI does not present a supply-channel arrangement as unconfirmed direct vendor supply.

### Should I send accounts and keys in the first conversation?

No. Send a credential-free resource description first. If technical validation is needed later, agree controlled credentials, permissions, duration and revocation.

### Is short-term supply acceptable?

Yes, if the supply period and end-of-term arrangements are stated. Short-term resources suit peak top-ups rather than workloads that need long-term stability.
