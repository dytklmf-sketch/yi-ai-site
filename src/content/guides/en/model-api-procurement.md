---
lang: en
pairKey: model-api-procurement
title: Model API pricing beyond the headline rate
description: Billing method, input/output mix, limits and settlement.
service: model-services
updatedAt: '2026-10-05'
order: 3
keyPoints:
  - 'Compare on the same model version, sample and metering basis.'
  - 'Cost each acceptable result; the lower unit price is not always cheaper.'
  - 'Judge latency at P95, and confirm limits, concurrency and quota separately.'
sources:
  - label: 'Google Gemini API: tokens'
    url: https://ai.google.dev/gemini-api/docs/tokens
  - label: 'Google Gemini API: rate limits'
    url: https://ai.google.dev/gemini-api/docs/rate-limits
  - label: 'OpenAI: prompt caching'
    url: https://platform.openai.com/docs/guides/prompt-caching
---

For developers preparing an integration, enterprise teams with existing usage, and anyone reviewing a current purchase. If the task is not defined, prepare representative inputs, expected outputs and required features before asking about models.

## Six comparison dimensions

1. **Model identity**: exact identifier, version, input/output types, context and output limits. Interface compatibility does not mean every feature is supported.
2. **Billing basis**: how input, output, cache and other items are counted; whether failures, retries, cancellations and long tasks are billed.
3. **Response**: for chat, time to first token versus full output; for asynchronous jobs such as images, time from submission to retrievable result.
4. **Usage limits**: request rate, token limits, concurrency and quota, confirmed separately. A large quota does not imply high concurrency.
5. **Quality and stability**: pass rate, error types and latency distribution on the same sample — not just an average or one success.
6. **Data and responsibility**: who processes inputs, how logs are kept, who responds to incidents, and what happens on model changes or at the end of cooperation.

## Filling in the comparison sheet

One row per option, with fixed columns. Download the [comparison sheet (CSV)](../../../templates/en/model-price-comparison.csv) and open it in any spreadsheet.

| Column                    | What to enter                         | Note                                  |
| ------------------------- | ------------------------------------- | ------------------------------------- |
| Model ID                  | The model name sent in the request    | Separate versions with the same name  |
| Input price               | Per million tokens                    | Currency, tax included or not         |
| Output price              | Per million tokens                    | Usually higher than input             |
| Cache price               | Price for cached input                | “None” if not billed separately       |
| Avg input / output tokens | Measured on your sample               | From the usage fields in responses    |
| Pass rate                 | Acceptable results ÷ all requests     | Timeouts and errors count as failures |
| Latency P50 / P95         | Median and the slowest 5%             | Not just the mean                     |
| Limits                    | Requests/min, tokens/min, concurrency | List separately                       |
| Settlement                | Prepaid, monthly, invoice type        | State the billing cycle               |

Every figure comes from a measurement or a written quote, never a verbal estimate. Write “open” where you do not know.

## Cost per acceptable result: a worked example

Unit prices alone mislead. The prices below are **examples**, not real quotes for any model.

A support-summary task sends about 3,000 input tokens per call.

- **Option A**: input 2 per million tokens, output 8 per million. Measured output averages 600 tokens; pass rate 90%.
  Per call = 3000 × 2 ÷ 1,000,000 + 600 × 8 ÷ 1,000,000 = 0.0108;
  per acceptable result = 0.0108 ÷ 0.9 ≈ 0.0120.
- **Option B**: input 1, output 6 — cheaper per token. But output averages 900 tokens and the pass rate is 60%.
  Per call = 3000 × 1 ÷ 1,000,000 + 900 × 6 ÷ 1,000,000 = 0.0084;
  per acceptable result = 0.0084 ÷ 0.6 = 0.0140.

The cheaper option B costs more per acceptable result — and more again if failed results need human rework.

Also include:

- **Caching**: when system prompts and fixed material are long, an API with prompt caching lowers the cost of repeated input. Estimate with the real hit rate, not the ideal.
- **Retries**: automatic retries after timeouts or errors consume usage too.
- **Monthly scale**: cost per acceptable result × monthly task volume, plus expected growth.

## Running a small comparison

Agree test scope, cost and rate limits with the provider. Use representative, permitted samples; fix parameters and output criteria; record request IDs, times and usage. Count timeouts and errors instead of only successful samples.

A reasonable size: 50–200 samples per option, called alternately in the same time window so time-of-day does not skew latency.

Estimate cost from the actual usage needed to complete one acceptable task and list what was not validated. Do not infer production stability from a single benchmark, and do not load-test without permission.

## Four common pricing mistakes

- **Looking only at input price**: output tokens usually cost more, so output length moves the total a lot.
- **Using mean latency for user experience**: users feel the slow requests; check P95.
- **Reading a quota as concurrency**: a large monthly allowance does not mean as many requests per minute.
- **Testing on samples unlike real work**: pass rates measured on easy samples usually drop in production.

## FAQ

### Is one token one Chinese character?

Do not use a fixed conversion for billing. Use the model’s metering documentation, the returned usage fields and the provider’s settlement basis.

### Does a fast first token mean the whole response is fast?

Not necessarily. First token, full output and asynchronous completion are different measures; record them separately for your workflow.

### Must I commit to monthly volume before asking?

No. Share a range, peak estimate and uncertainties first. Available models, prices and conditions depend on the actual discussion.

### What if prices change?

Agree how and when price changes are notified. Keep quote dates in the sheet and recompute cost per acceptable result when prices move.
