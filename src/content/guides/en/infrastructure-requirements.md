---
lang: en
pairKey: infrastructure-requirements
title: How to describe infrastructure needs
description: Workload type, model size, duration and data location.
service: infrastructure
updatedAt: '2026-10-05'
order: 5
keyPoints:
  - 'A request states five things: what runs, what it needs, how it connects, how long it runs and who manages it.'
  - 'A hardware model is one condition; describe it together with the workload.'
  - 'Easy AI owns a self-built data center; equipment, capacity, location and scope are confirmed per request.'
sources:
  - label: 'Google Cloud Architecture Framework: shared responsibility'
    url: https://docs.cloud.google.com/architecture/framework/security/shared-responsibility-shared-fate
  - label: 'Hugging Face: optimizing LLMs for speed and memory'
    url: https://huggingface.co/docs/transformers/main/en/llm_tutorial_optimization
---

For enterprise technical teams, application owners and infrastructure partners at the first conversation. If you are still validating, share ranges, existing measurements and open questions instead of precise-looking purchase quantities.

## Six groups of requirements

1. **Purpose**: development, testing or production; whether it runs continuously and which interruptions are acceptable.
2. **Compute**: required CPU, memory, accelerators and runtime; separate “must have” from “substitutable”.
3. **Storage**: current data volume, growth, read/write pattern, backup and recovery targets.
4. **Network**: who connects, direction, bandwidth estimate, fixed addresses or isolation, and who approves.
5. **Timing**: start and end dates, validation window, possible scale-up points and exit date.
6. **Responsibilities**: who owns hardware, systems, applications, accounts, logs and backups, and whom to call on incidents.

For sensitive data and access, describe classifications and restrictions first. Do not send real business data or admin passwords in the first inquiry.

## A sample workload request

A fictional example; the project and figures are assumptions. You can also download the [workload brief](../../../templates/en/workload-brief.txt) and fill it in.

| Field                  | Example                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| Workload               | Inference service, internal knowledge-base Q&A                   |
| Model                  | Open-source LLM, about 7B parameters, BF16                       |
| Concurrency and length | About 20 concurrent requests at peak, ~4,000 input tokens each   |
| Compute                | At least one accelerator with 24 GB+ memory; model substitutable |
| Storage                | ~15 GB model files, ~200 GB documents, daily incremental backup  |
| Network                | Office network access only; fixed egress address needed          |
| Duration               | About a year; first two weeks for validation                     |
| Interruptions          | None during weekday office hours; maintenance at night           |
| Responsibilities       | We own application and data; hardware, network, OS to agree      |
| Open                   | Whether a second machine is needed for redundancy                |

“About 7B parameters in BF16” means roughly 14 GB of weights; the method is in [sizing a self-hosted model](../self-hosted-llm-sizing/).

## Choosing a deployment form

The same workload can run in different forms. Once the form is settled, resources can be checked.

| Form                         | Suits                                             | You are responsible for                |
| ---------------------------- | ------------------------------------------------- | -------------------------------------- |
| Whole machine (bare metal)   | Long-running, high performance or isolation needs | OS, drivers, runtime and application   |
| Virtual machine or container | Moderate needs, flexible sizing                   | Runtime and application                |
| Managed inference            | Calling an API without managing machines          | Integration, data and checking results |

Each form draws the responsibility line differently. Whether a form is available depends on actual resources.

## Turning the request into a proposal

Describe the current environment and workload, then turn existing monitoring or tests into ranges. Label assumptions where you cannot measure, and do not present estimates as guarantees.

Next, check matching resources, operating conditions and duration. Only once resources and responsibilities are confirmed should pricing, validation and implementation be discussed.

## Four things requests leave out

- **Quoting only a hardware model**: the same model supports very different volumes at different concurrency and context lengths; describe the workload too.
- **Treating peak as normal**: state normal usage and peak separately, and how long peaks last.
- **Forgetting storage and network**: storing and moving model files, logs and data often becomes the bottleneck before compute does.
- **No exit plan**: decide up front how data is exported at the end and how long that takes.

## FAQ

### Can I ask directly for a particular hardware model?

Yes, but also describe purpose, quantity, environment and acceptable alternatives. Availability must be confirmed; it cannot be inferred from “self-built data center”.

### What if I do not know exact usage?

Give a range, its basis and growth assumptions. Validation can be discussed, but its resources, cost and schedule are confirmed separately.

### Does using a model API mean the model runs in this data center?

No. Model access channels and infrastructure are separate matters, and the actual location of third-party models cannot be inferred from Easy AI owning a data center.

### Can training and inference go in one request?

Better to separate them. They differ greatly in memory, storage and duration; see [training, fine-tuning and inference](../training-vs-inference/).
