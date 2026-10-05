---
lang: en
pairKey: token-cost-estimation
title: Estimating tokens and monthly cost
description: What a request's tokens are made of, how to measure them, how to project a monthly cost and how to lower it.
service: model-services
updatedAt: '2026-10-05'
order: 8
keyPoints:
  - 'Monthly cost = requests × (avg input tokens × input price + avg output tokens × output price).'
  - 'System prompts, history and retrieved material usually dominate the input.'
  - 'Measure with the usage fields in responses; never convert characters at a fixed ratio.'
sources:
  - label: 'Google Gemini API: tokens'
    url: https://ai.google.dev/gemini-api/docs/tokens
  - label: 'OpenAI: tiktoken tokenizer'
    url: https://github.com/openai/tiktoken
  - label: 'OpenAI: prompt caching'
    url: https://platform.openai.com/docs/guides/prompt-caching
---

For product and technical owners budgeting an AI feature, and for teams whose bill came in higher than expected. Without a working prototype, measure a few typical requests and project from them with this method.

## What a request is made of

Many people count only the user’s message. In practice a request’s input usually includes:

| Part               | What it is                            | Why it is overlooked          |
| ------------------ | ------------------------------------- | ----------------------------- |
| System prompt      | Role, rules, output format            | Sent again with every request |
| History            | Earlier turns of the conversation     | Grows with each turn          |
| Retrieved material | Document chunks from a knowledge base | Often the largest part        |
| Tool definitions   | Descriptions of callable tools        | Can reach thousands of tokens |
| User input         | This turn’s question                  | Usually the smallest part     |

Output is the generated answer. Some reasoning models also bill their thinking as output; check the official description for each model.

## Measure, don’t guess

Models use different tokenizers, so the same text can produce noticeably different token counts. Do not use a fixed ratio. Two reliable methods:

1. **Read the usage fields**: responses usually report input and output tokens — the direct basis for billing.
2. **Estimate with a tokenizer**: tools such as OpenAI’s open-source tiktoken count tokens offline before sending, but only for the matching tokenizer.

Prepare 20–50 representative real requests (with sensitive data removed), record the tokens of each part, and keep both the average and the high end.

## Projecting monthly cost

The formula:

> Monthly cost = requests per month × (avg input tokens × input price + avg output tokens × output price)

A fictional support-assistant example with **example prices**: input 2 per million tokens, output 8 per million.

- Input per request: system prompt 800 + history 1,200 + retrieved material 2,000 + user input 100 = **4,100 tokens**
- Output per request: **300 tokens** on average
- 5,000 conversations a day at 3 turns each = 15,000 requests a day, **450,000 a month** (30 days)

Calculation:

- Input: 450,000 × 4,100 = 1.845 billion tokens × 2 per million = **3,690**
- Output: 450,000 × 300 = 135 million tokens × 8 per million = **1,080**
- Total about **4,770 a month**

The user’s message is only 100 tokens; retrieved material and history dominate. Add headroom for peaks and growth, for example ×1.2 to ×1.5.

## Common ways to lower cost

1. **Limit history**: keep only recent turns or summarise earlier ones.
2. **Trim retrieval**: include only the most relevant chunks, not whole documents.
3. **Use prompt caching**: when fixed content such as the system prompt is long, APIs with caching bill cache hits at a lower rate. In the example, if the 800-token system prompt always hits a cache priced at a tenth of input (an example rate), the saving is about 648 a month. Real savings depend on hit rate and the provider’s rules.
4. **Cap output**: set an output limit and ask for concise answers.
5. **Match models to tasks**: smaller models for simple classification or extraction, larger ones for complex work.
6. **Track usage by feature**: tag each request with its feature and optimise the heaviest first.

## Four common estimating mistakes

- **Counting only the user’s message**: system prompt, history and retrieval are often over 90% of input.
- **Fixed character-to-token ratios**: tokenizers differ; measure.
- **Ignoring retries and failures**: automatic retries consume usage too.
- **Estimating once**: feature changes and longer prompts shift usage; review monthly.

## FAQ

### Why does output cost more than input?

Most models price output tokens higher, reflecting how generation is computed. Use each model’s official pricing or quote.

### How do I set a budget alert?

Total usage and cost daily and notify an owner when a threshold is crossed. Many API platforms also show usage you can compare with your own records.

### Does pilot usage predict production?

Usually not. Pilots have fewer users and simpler questions; production conversations are longer and retrieve more. Watch the first month closely.

### How do I negotiate enterprise pricing?

Put a monthly volume estimate from this method, the input/output ratio and peak load into the [usage brief](../../../templates/en/model-usage-brief.txt), then talk to the provider. Prices and settlement follow the actual quote.
