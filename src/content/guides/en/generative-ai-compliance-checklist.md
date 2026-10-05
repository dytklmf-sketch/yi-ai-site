---
lang: en
pairKey: generative-ai-compliance-checklist
title: Data and compliance checklist for enterprise generative AI
description: What to check before adopting generative AI in China — which rules apply, personal information, content labels and supplier terms.
service: workbuddy
updatedAt: '2026-10-05'
order: 11
keyPoints:
  - 'Compliance centres on three things: internal use or a public service, which personal information is processed, and how generated content is published.'
  - 'Send no personal information unless you must; when you must, mask it and ask whether the raw data is still needed.'
  - 'This checklist is not legal advice; your legal counsel decides.'
sources:
  - label: 'Cyberspace Administration of China: Interim Measures for Generative AI Services (Chinese)'
    url: https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm
  - label: 'Cyberspace Administration of China: Personal Information Protection Law (Chinese)'
    url: https://www.cac.gov.cn/2021-08/20/c_1631050028355286.htm
  - label: 'Cyberspace Administration of China: Measures for Labeling AI-Generated Content (Chinese)'
    url: https://www.cac.gov.cn/2025-03/14/c_1743654684782215.htm
---

For business owners, legal teams and IT administrators preparing to buy AI applications, integrate model APIs or deploy models. Healthcare, finance, minors and similar sectors or groups may have additional rules to check.

## Which situation are you in?

Article 2 of the Interim Measures for the Management of Generative AI Services (in force since 15 August 2023) applies them to services that use generative AI to provide text, images, audio, video and other content **to the public within China**. Enterprises and others that research or apply generative AI **without providing such services to the public in China** are outside the Measures.

| Situation                       | Example                                        | What to watch                                                        |
| ------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| Internal use                    | Staff use AI to compile material or draft text | Internal policy, approval for sending data out, personal information |
| Inside your own public product  | An AI generation feature in your app           | All of the above, plus the Interim Measures and labeling rules       |
| Publishing AI-generated content | Marketing images or video made with AI         | Content labeling and the publishing platform’s rules                 |

Being outside the Interim Measures does not mean no obligations: the Personal Information Protection Law, data-security rules and your own policies still apply.

## Personal information: the articles to check

From the Personal Information Protection Law (in force since 1 November 2021), the articles most relevant to enterprise AI use:

1. **A lawful basis** (Article 13): such as consent or necessity for concluding or performing a contract. Before sending customer data to AI, check the basis covers that use.
2. **Entrusted processing needs an agreement** (Article 21): when an outside service processes personal information, agree purpose, duration, method, types of information, protection measures and each side’s rights and duties; the processor may not sub-entrust without consent.
3. **Sensitive information needs separate consent** (Articles 28–29): biometrics, medical and health data, financial accounts, location tracks and the information of minors under 14 are sensitive.
4. **Impact assessment** (Article 55): processing sensitive information, automated decision-making, entrusting or providing personal information to others, or transferring it abroad requires a prior personal information protection impact assessment.

The simplest working rule: **do not send personal information unless you must**. When you must, mask or de-identify it first, then ask whether the raw data is still needed.

## Content labeling

The Measures for Labeling AI-Generated and Synthetic Content, in force since 1 September 2025, define two kinds of label:

- **Explicit labels**: added to the content or interface as text, sound or graphics that users can clearly perceive.
- **Implicit labels**: added to the content’s file data by technical means, not readily perceived by users.

For an enterprise this means:

- **As a service provider** offering AI generation to users, add labels as the Measures require.
- **As a user** publishing AI-generated content on an online platform, declare it proactively and use the platform’s labeling function; do not remove, alter, forge or hide labels.

## What to confirm with suppliers

Whether buying an AI application or integrating a model API, get these in writing:

| Item                  | What to ask                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| Data use              | Is input used to train models, and can that be turned off?                     |
| Storage and retention | Where input and output are kept, for how long, and whether they can be deleted |
| Processing location   | Whether data is processed outside China                                        |
| Access                | Which supplier staff can see data and how access is approved                   |
| Sub-processing        | Whether third parties process data, and who they are                           |
| Incidents             | How and how quickly you are told about a breach                                |
| Contract              | Whether all of the above is in the service or data-processing agreement        |

Treat anything without a written answer as unknown, and keep the corresponding data away from that service.

## Internal usage rules

A one-page internal policy can set out how staff use AI:

1. **Approved tools**: list approved AI tools and account types; personal accounts do not handle company material.
2. **What must not be entered**: customer personal information, unpublished financials, contract originals, keys in source code and the like.
3. **Results are reviewed**: a person checks facts, figures and citations before anything AI-generated is used externally.
4. **Label what you publish**: follow platform rules and the labeling Measures.
5. **Who to tell**: a contact for mistakenly shared sensitive material or anything unusual.
6. **Regular review**: update when tools, rules or supplier terms change.

## FAQ

### Do we need to file if staff only use AI internally?

Article 2 of the Interim Measures excludes cases where no generative AI service is provided to the public in China. Whether other filings or approvals apply depends on the business; ask your legal counsel.

### Is sending files to an AI application for summaries entrusted processing?

If the files contain personal information and an outside service processes them, you should usually treat it as entrusted processing, with an agreement and safeguards. Your legal counsel decides.

### Do AI-generated ad images need a label?

When published on an online platform, declare them and use the platform’s labeling function under the labeling Measures. Advertising rules may also apply.

### Can Easy AI give compliance advice?

No. Easy AI can help organise procurement and integration requirements; compliance judgements belong to your legal counsel.
