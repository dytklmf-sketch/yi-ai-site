---
lang: en
pairKey: openai-compatible-migration
title: Moving to another OpenAI-compatible API
description: What to change and what to test — base URL, key, model name, streaming, tool calls and errors.
service: model-services
updatedAt: '2026-10-05'
order: 7
keyPoints:
  - '“Compatible” means the request and response formats match; parameters, features and errors still need checking one by one.'
  - 'The code changes in three places — base URL, key, model name — with URL and key kept in configuration.'
  - 'Go live through a shadow test and a small traffic share, with a rollback switch.'
sources:
  - label: 'Google Gemini API: OpenAI compatibility'
    url: https://ai.google.dev/gemini-api/docs/openai
  - label: 'Anthropic: OpenAI SDK compatibility'
    url: https://docs.anthropic.com/en/api/openai-sdk
  - label: 'vLLM: OpenAI-compatible server'
    url: https://docs.vllm.ai/en/latest/serving/openai_compatible_server.html
---

For developers whose application already uses the official OpenAI SDK or the compatible format and who are switching to another API, and for teams connecting several model sources. Applications depending on vendor-specific features (such as particular file or assistant endpoints) need a separate assessment.

## The three changes in code

With the official Python SDK, the change sits where the client is created:

```python
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.example.com/v1",  # the new API's base URL
    api_key=os.environ["MODEL_API_KEY"],    # read the key from the environment
)

resp = client.chat.completions.create(
    model="<model>",                         # the model ID on the new API
    messages=[{"role": "user", "content": "Hello"}],
)
print(resp.choices[0].message.content)
print(resp.usage)                            # keep usage for reconciliation
```

The URL is only an example; use the base URL and model names your provider gives you. Three rules:

- **Keep the URL and key in configuration**, not in code, so switching and rolling back are easy.
- **Keep keys in environment variables or a secrets manager**, never in the repository or a chat.
- **Map model names**: business code uses your own aliases; switching sources changes only the map.

## Feature checklist

For each feature your application uses, test with real requests:

| Feature               | What to check                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------- |
| Basic chat            | Multi-turn messages and the system prompt behave as expected                                |
| Generation parameters | temperature and top_p ranges; whether the output cap is max_tokens or max_completion_tokens |
| Streaming             | Chunk format, end marker; whether usage is returned when streaming                          |
| Tool calls            | tools schema, parallel calls, tool_choice support                                           |
| Structured output     | JSON mode or JSON Schema support and behaviour on failure                                   |
| Multimodal input      | Image formats and size limits                                                               |
| Embeddings            | Whether provided, and whether dimensions match your index                                   |
| Usage fields          | Every usage item present; cached tokens listed separately                                   |
| Error codes           | Status and message for rate limits, timeouts and content blocks                             |

Some APIs reject unsupported parameters; others silently ignore them. Silent ignoring is worse — confirm in testing that each parameter really takes effect.

## Errors and retries

After migration, problems appear on the error paths rather than normal requests:

1. **Rate limits (429)**: retry with exponential backoff and a maximum number of attempts, never immediately and endlessly.
2. **Server errors (5xx)**: retry, but check whether the request was billed.
3. **Timeouts**: separate connect and read timeouts; long outputs need a longer read timeout.
4. **Content blocks**: rules and response formats differ between APIs; show users a clear message.
5. **Log request IDs**: record time, model, usage and the returned request ID for every call, for reconciliation and debugging.

## Cutting over

1. **Shadow test**: copy production requests to the new API, log without returning results, compare output and latency.
2. **Small share**: move 5–10% of traffic and watch error rate, latency and user feedback.
3. **Keep a rollback switch**: configuration can point back to the old API without redeploying code.
4. **Expand step by step**: confirm the previous stage’s metrics before each increase.
5. **Reconcile**: in the first billing cycle after the switch, compare your logged usage with the bill.

## Four common migration slips

- **Going live after one request**: a normal request passing says nothing about streaming, tool calls or errors.
- **Model names hard-coded in business logic**: every model change means a code change and release.
- **Missing silently ignored parameters**: an output cap that does not take effect means higher costs.
- **No rollback plan**: when the new API misbehaves, the only fix is an emergency code change.

## FAQ

### Can I keep using the official SDK?

Usually, by pointing the SDK at the new base URL. Features added in newer SDK versions may not be supported by a compatible API, so re-test after SDK upgrades.

### Does the same model behave the same on different APIs?

Not necessarily. Deployment, defaults and context limits can differ. Compare on the same samples instead of assuming.

### How long does migration take?

The code change is small; the time goes into testing and gradual cut-over. The more features you use, the more there is to check.

### Which models can Easy AI provide?

Available models follow the product entry on the [model services page](../../model-services/) and the actual discussion. Enterprise volume and settlement are confirmed separately.
