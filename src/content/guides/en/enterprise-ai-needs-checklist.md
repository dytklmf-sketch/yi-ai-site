---
lang: en
pairKey: enterprise-ai-needs-checklist
title: A one-page enterprise AI brief
description: The task, the data, acceptance criteria and the owner.
service: workbuddy
updatedAt: '2026-10-05'
order: 2
keyPoints:
  - 'A useful brief names four things: the task, an acceptable result, usable material and an owner.'
  - 'Start with one bounded task a person can check quickly, and record today’s process as the baseline.'
  - 'Decide quantities and wider rollout only after validating on a fixed sample.'
sources:
  - label: Tencent WorkBuddy official product entry
    url: https://www.codebuddy.cn/work/
  - label: 'Cyberspace Administration of China: Interim Measures for Generative AI Services (Chinese)'
    url: https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm
---

For business owners starting with AI and for teams with several ideas that need prioritising. Where the material cannot lawfully be provided, results cannot be judged or nobody owns review, those conditions come before anything else.

## What belongs on the page

1. **Business goal**: the problem in today’s work, such as time spent compiling material, not “full intelligent transformation”.
2. **Task flow**: who starts the task, what goes in, who receives the output and which steps need approval.
3. **Data boundary**: where material comes from, permitted use, whether it needs masking and whether external services may process it.
4. **Result standard**: required format, mandatory fields, fact-checking and acceptable amount of human editing.
5. **Constraints and owners**: users, budget range, timing, existing systems, internal owner and reviewer.

If it does not fit on one page, the scope is still too broad. Split it into several tasks with one page each.

## A filled-in example

A fictional example; the company and figures are assumptions.

| Field         | Example                                                                    |
| ------------- | -------------------------------------------------------------------------- |
| Task          | Weekly summary of competitors’ public material                             |
| Today         | Two marketing staff spend about half a day each, every week                |
| Input         | Listed public web pages and announcement PDFs; no internal material        |
| Output        | One page: three points per company, each with a source link                |
| Human review  | The marketing manager checks facts and links before sending                |
| Data boundary | Public material only; no client lists, contracts or unreleased information |
| Acceptance    | Four weeks in a row, every point sourced, review edits under a third       |
| Users         | Two in the pilot, then the eight-person marketing team                     |
| Owners        | Business: marketing manager; accounts and approval: IT admin               |
| Timing        | Four-week pilot, review at month end                                       |

You can send this table with the [request template](../../../templates/en/workbuddy-purchase-brief.txt).

## Choosing the first task

Compare frequency, availability of material, impact of errors and review cost. Score each candidate from 1 to 3 on four dimensions and start with a high total whose error impact is not 3.

| Dimension    | 1 point                       | 3 points                             |
| ------------ | ----------------------------- | ------------------------------------ |
| Frequency    | Once a quarter                | Daily or several times a week        |
| Material     | Must be collected or approved | Available and lawful to use          |
| Review       | Hard to judge right or wrong  | Quick for a person to check          |
| Error impact | Easily corrected              | Affects clients, money or compliance |

Record today’s manual results and time as the baseline. Without one, you cannot show whether AI improved anything.

## Designing the pilot

1. **Fixed sample**: 10–30 representative, permitted items that stay the same throughout.
2. **Fixed standard**: score each item against the acceptance criteria and note every human edit.
3. **Record everything**: failures, timeouts and redos count, not only the best attempt.
4. **Record usage**: credits for WorkBuddy, tokens for model APIs; cost estimates need them.
5. **Graded verdict**: roll out, adjust and retry, or not suitable yet — with reasons.

Purchase quantity and wider rollout come after validation on the fixed sample. Without real data, promise no percentage savings.

## Four ways briefs go wrong

- **Picking the tool before the task**: only a defined task tells you whether a tool fits.
- **Covering a whole department at once**: the wider the scope, the harder the acceptance. Start with one team and one task.
- **Ignoring the data boundary**: check internal policy and contracts before sending internal material to an external service.
- **Confusing public services with internal use**: offering generative AI services to the public in China falls under the Interim Measures for Generative AI Services and related rules; internal use still needs its own approval rules.

## FAQ

### Is it better to submit many needs at once?

You can keep a master list, but give each item its own owner, inputs and acceptance criteria. Different tasks may need different products or arrangements and need not be bundled into one unproven project.

### Should we start from the tool or the task?

From the task. Once it is written down, official descriptions and validation results show whether a product fits; buying a tool does not change the workflow by itself.

### Can we start without technical staff?

Yes, by describing the business task. Involve authorised staff when integration, account permissions or data handling arise, and do not bypass internal approval for a trial.

### How long should a pilot run?

It depends on frequency. Observe a weekly task at least four times; a daily task usually gives enough samples in one or two weeks.
