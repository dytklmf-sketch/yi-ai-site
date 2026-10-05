---
lang: en
pairKey: training-vs-inference
title: Training, fine-tuning and inference compared
description: How the three workloads differ in memory, storage, network and duration, and what to state for each.
service: infrastructure
updatedAt: '2026-10-05'
order: 10
keyPoints:
  - 'Inference runs long-term and serves users; full training concentrates heavy memory and storage use; parameter-efficient fine-tuning sits between.'
  - 'Mixed-precision training needs about 18 bytes per parameter, plus activations.'
  - 'Describe training and inference separately so each can be checked against resources.'
sources:
  - label: 'Hugging Face: GPU memory usage in training'
    url: https://huggingface.co/docs/transformers/main/en/model_memory_anatomy
  - label: 'Hugging Face PEFT: parameter-efficient fine-tuning'
    url: https://huggingface.co/docs/peft/index
  - label: 'Hugging Face: optimizing LLMs for speed and memory'
    url: https://huggingface.co/docs/transformers/main/en/llm_tutorial_optimization
---

For technical teams customising open-source models who need resources for both training and serving. Teams that only serve a model can go straight to [sizing a self-hosted model](../self-hosted-llm-sizing/).

## The three workloads side by side

|                | Inference                | Parameter-efficient fine-tuning (e.g. LoRA)             | Full training or fine-tuning                         |
| -------------- | ------------------------ | ------------------------------------------------------- | ---------------------------------------------------- |
| Memory goes to | Weights + KV cache       | Frozen weights + few trainable parameters + activations | Weights + gradients + optimizer states + activations |
| Memory scale   | About 1–2× the weights   | A little above inference                                | Several times the weights                            |
| Duration       | Long-term, continuous    | Hours to days                                           | Days to months                                       |
| Interruption   | Directly affects users   | Resume from a checkpoint                                | Resume from a checkpoint, losing progress            |
| Storage focus  | Model files, logs        | Datasets, adapter files                                 | Datasets, many checkpoints                           |
| Network focus  | External access, latency | Ordinary                                                | Fast interconnect across machines                    |

## Estimating memory for training

Hugging Face’s official documentation breaks down per-parameter memory in mixed-precision training:

| Part                    | Bytes per parameter | Note                                                             |
| ----------------------- | ------------------- | ---------------------------------------------------------------- |
| Weights                 | 6                   | A 16-bit copy for compute, a 32-bit copy for updates             |
| Optimizer states (Adam) | 8                   | Two 32-bit states                                                |
| Gradients               | 4                   | 32-bit                                                           |
| Total                   | About 18            | Plus activations, which grow with batch size and sequence length |

On that basis, full training of a 7B model needs about 126 GB for weights, gradients and optimizer states alone; with activations it usually needs several cards.

Parameter-efficient fine-tuning **freezes the original model and trains a small number of added parameters**. Because most parameters need no gradients or optimizer states, memory is close to inference weights plus activations, and quantizing the frozen weights (often called QLoRA) lowers it further. Check the PEFT documentation and your own tests for specifics.

## Storage and network differences

- **Checkpoints**: full training saves checkpoints regularly, each possibly holding weights and optimizer states — several times the model file. Estimate how many to keep and the total space.
- **Datasets**: state where training data lives, read speed and access rights; confirm whether sensitive data may sit in a partner data center.
- **Multi-machine interconnect**: when one machine is not enough, bandwidth between machines strongly affects training speed.
- **External access for inference**: state who connects, concurrency and latency needs, and whether fixed addresses or isolation are required.

## What to state for each

**Training or fine-tuning:**

1. Base model and size; full or parameter-efficient.
2. Dataset size, format, location and sensitivity.
3. Expected duration and whether it can resume from checkpoints.
4. Number of checkpoints to keep and storage needed.
5. Where model files go at the end and how the environment is cleaned up.

**Inference:**

1. Model, precision and whether it is quantized.
2. Distribution of concurrency, context length and output length.
3. Duration, interruptible periods and maintenance windows.
4. Access method, network isolation and fixed-address needs.
5. Monitoring, logs and incident contacts.

Submit both together if you like, but describe them separately so each can be checked against resources.

## Four common planning mistakes

- **Sizing training with inference numbers**: full training needs several times the memory.
- **Forgetting checkpoint storage**: a full disk halfway through is a common cause of failed runs.
- **Training and serving on the same resources**: heavy training load undermines a live service.
- **No hand-over at the end of training**: agree up front where model files, data and logs go.

## FAQ

### Is training needed before going live?

No. Many cases are met by an existing model with prompt design and retrieval. Validate with inference and fine-tune only if needed.

### How is a LoRA-tuned model deployed?

Merge the adapter into the base model, or load adapters dynamically in the serving framework, depending on what your framework supports.

### Can training use hourly resources?

That depends on the provider. When duration can be estimated, reserving for the period is easier to plan; confirm case by case.

### Can Easy AI take on training jobs?

That is confirmed per model size, duration and data requirements. Prepare a request with this method and describe it on the contact page.
