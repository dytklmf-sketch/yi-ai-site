---
lang: en
pairKey: self-hosted-llm-sizing
title: Sizing GPU memory for a self-hosted model
description: Estimate memory for weights, KV cache and headroom, weigh quantization, then measure on real hardware.
service: infrastructure
updatedAt: '2026-10-05'
order: 9
sources:
  - label: 'Hugging Face: optimizing LLMs for speed and memory'
    url: https://huggingface.co/docs/transformers/main/en/llm_tutorial_optimization
  - label: vLLM documentation
    url: https://docs.vllm.ai/en/latest/
  - label: 'NVIDIA: GPU performance background'
    url: https://docs.nvidia.com/deeplearning/performance/dl-performance-gpu-background/index.html
---

## The short answer

Inference memory has three main parts: **model weights, KV cache and runtime headroom**. Weights are parameters × bytes per parameter. The KV cache grows with concurrency and context length and, under heavy load with long contexts, can exceed the weights. Estimates narrow the range; the final configuration must be measured with the real serving framework and real requests.

This is an estimation method. It does not mean Easy AI’s data center has the corresponding equipment or capacity; resources are confirmed separately.

## When this applies

For technical teams planning to run an open-source model in their own or a partner’s data center and needing to state resource requirements. Training and fine-tuning differ; see [training, fine-tuning and inference](../training-vs-inference/).

## What uses the memory

| Part     | How to estimate                   | Depends on                                |
| -------- | --------------------------------- | ----------------------------------------- |
| Weights  | Parameters × bytes per parameter  | Model size, precision (quantization)      |
| KV cache | Per-token size × tokens in flight | Concurrency, context length, architecture |
| Headroom | Rule of thumb: 10–20%             | Framework, intermediate compute, drivers  |

Bytes per parameter depend on precision:

| Precision   | Bytes per parameter | 7B parameters | 70B parameters |
| ----------- | ------------------- | ------------- | -------------- |
| FP32        | 4                   | 28 GB         | 280 GB         |
| BF16 / FP16 | 2                   | 14 GB         | 140 GB         |
| INT8        | 1                   | 7 GB          | 70 GB          |
| INT4        | 0.5                 | 3.5 GB        | 35 GB          |

Hugging Face’s official guide gives the same rule: loaded in BF16, weights need about twice the parameter count (in billions) in GB.

## Steps and a worked example

The per-token KV cache follows from the model configuration:

> KV cache per token = 2 × layers × KV heads × head dimension × bytes per value

The leading 2 covers K and V. Layers, KV heads and head dimension are in the model’s config file.

A **fictional but typical** configuration: about 8B parameters, 32 layers, 8 KV heads, head dimension 128, running in BF16.

1. **Weights**: 8B × 2 bytes ≈ 16 GB.
2. **KV cache per token**: 2 × 32 × 8 × 128 × 2 bytes = 131,072 bytes = 128 KB.
3. **Tokens in flight**: 20 concurrent requests at peak, ~4,000 tokens of context each: 80,000 tokens.
4. **KV cache total**: 80,000 × 128 KB ≈ 10 GB.
5. **With headroom**: (16 + 10) × 1.15 ≈ 30 GB.

So a single 24 GB card cannot hold this configuration. Options:

- a card with more memory, or two cards sharing the load;
- INT8 weights (about 8 GB), bringing the total to about 21 GB — but evaluate the quality change;
- a lower concurrency cap or shorter context to shrink the KV cache.

A 70B-class model needs about 140 GB for BF16 weights alone and must run across several cards.

## Weighing quantization

Quantization cuts weight memory sharply but can affect output quality, depending on the model, method and task. We suggest:

1. Test full precision and the quantized version on the same real samples.
2. Score against your acceptance criteria, not just general benchmarks.
3. Adopt the quantized version only if the quality drop is acceptable.

Some serving frameworks can also quantize the KV cache to save more memory; test that too.

## Measuring after the estimate

The estimate is a starting point. Before going live, measure on the target hardware:

1. **Pick the serving framework**: for example vLLM or another server with an OpenAI-compatible API; how it manages memory affects real capacity.
2. **Load-test with real distributions**: request length, concurrency and output length as in production, not just short requests.
3. **Record key metrics**: time to first token, tokens per second, P95 latency, peak memory and error rate.
4. **Find the knee**: raise concurrency step by step and note where latency starts climbing; use it as the capacity reference.
5. **Leave headroom**: keep normal load below the knee so peaks fit.

Load-test only in an authorised environment that does not affect other workloads.

## Common mistakes

- **Counting weights only**: with high concurrency and long contexts, the KV cache can exceed the weights.
- **Sizing every request at maximum context**: grossly overestimates; size from the real distribution and leave room for long requests.
- **Quantizing without testing quality**: memory is saved, but results may fail acceptance.
- **Watching memory, not bandwidth**: generation speed also depends on memory bandwidth and compute; enough memory does not mean enough speed.

## FAQ

### If memory fits, is speed guaranteed?

No. Speed depends on compute, memory bandwidth and the serving framework. Memory decides whether it runs; measure speed.

### Are several cards better than one large card?

Not necessarily. Multiple cards add inter-card communication overhead; if one card fits, it is usually simpler. It depends on the model and available equipment.

### Where do I find the model configuration?

Open-source model releases usually include a config file listing layers, attention heads and similar parameters. Use the official release.

### Which GPUs can Easy AI provide?

That is confirmed per workload and duration. Prepare your requirements with this method and describe them on the contact page.
