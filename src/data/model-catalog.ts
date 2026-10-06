import type { Lang } from './yi-ai';

/**
 * Round 48: the model services page in as much detail as WorkBuddy's. Models come from the public catalog at
 * https://ccg-cli.online/models/ (`/api/shop/models/pricing`): only each family's main models, without channel
 * variants. Prices stay on the catalog (the owner's call); this page explains how billing works.
 */
type Family = { name: string; maker: string; models: string[]; tags: string[] };
type Catalog = {
  label: string;
  title: [string, string];
  lead: string;
  families: Family[];
  note: string;
};

export const modelLinks = {
  catalog: 'https://ccg-cli.online/models/',
  docs: 'https://ccg-cli.online/docs/',
  quota: 'https://ccg-cli.online/quota/',
  account: 'https://ccg-cli.online/account/',
  agent: 'https://ccg-cli.online/account/agent/',
  baseUrl: 'https://ccg-cli.online/v1',
};

export const modelCatalog: Record<Lang, Catalog> = {
  zh: {
    label: '模型目录',
    title: ['CCG API 模型目录', '一个 Key 调用各家主力模型'],
    lead: '聚合国际与国产主流模型，统一用 OpenAI 兼容格式调用，Claude、Gemini、DeepSeek 等也接受 Anthropic 格式。以下是各家的主力型号，完整列表与实时价格见模型广场。',
    families: [
      {
        name: 'Claude',
        maker: 'Anthropic',
        models: ['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'],
        tags: ['推理', '工具调用', '1M 上下文'],
      },
      {
        name: 'GPT',
        maker: 'OpenAI',
        models: ['gpt-6.1-sol', 'gpt-6-astra', 'gpt-6-luna', 'gpt-5.5'],
        tags: ['推理', '视觉', '1M 上下文'],
      },
      {
        name: 'Gemini',
        maker: 'Google',
        models: ['gemini-3.1-pro', 'gemini-3.5-flash', 'gemini-3-flash'],
        tags: ['推理', '音频', '1M 上下文'],
      },
      {
        name: 'Grok',
        maker: 'xAI',
        models: ['grok-4.7', 'grok-4.6', 'grok-4.5'],
        tags: ['推理', '视觉', '500K 上下文'],
      },
      {
        name: 'DeepSeek',
        maker: '深度求索',
        models: ['deepseek-v4-pro', 'deepseek-v4.1-flash', 'deepseek-v4-flash'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: '通义千问',
        maker: '阿里巴巴',
        models: ['qwen3.8-max', 'qwen3.8-flash', 'qwen3.7-plus', 'qwen3.8-omni-flash'],
        tags: ['推理', '全模态', '1M 上下文'],
      },
      {
        name: 'GLM',
        maker: '智谱',
        models: ['glm-5.3', 'glm-5.3-flash', 'glm-5.2'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: 'Kimi',
        maker: '月之暗面',
        models: ['kimi-k3', 'kimi-k2.7', 'kimi-k2.6'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: 'MiniMax',
        maker: 'MiniMax',
        models: ['MiniMax-M3', 'MiniMax-M3-highspeed', 'MiniMax-M2.7'],
        tags: ['推理', '高速版', '1M 上下文'],
      },
      {
        name: '豆包 Seed',
        maker: '字节跳动',
        models: ['doubao-seed-2.1-turbo', 'doubao-seed-2.0-pro', 'doubao-seed-2.0-code'],
        tags: ['推理', '编程', '视觉'],
      },
      {
        name: 'MiMo',
        maker: '小米',
        models: ['mimo-v2.6-pro', 'mimo-v2.5-pro', 'mimo-v2.5'],
        tags: ['推理', '音频', '开放权重'],
      },
      {
        name: '图片与视频',
        maker: 'OpenAI · Google · 字节跳动',
        models: ['gpt-image-2', 'gemini-3-pro-image-preview', 'gemini-3.1-flash-image-preview', 'doubao-seedance-2.5'],
        tags: ['文生图', '图片编辑', '视频生成'],
      },
    ],
    note: '型号随上游更新，可用模型与价格以模型广场为准。',
  },
  en: {
    label: 'Models',
    title: ['CCG API models', 'One key for the leading models'],
    lead: 'International and Chinese models behind one OpenAI-compatible API; Claude, Gemini, DeepSeek and others also take the Anthropic format. Below are each family’s main models; the catalog lists every model with live prices.',
    families: [
      {
        name: 'Claude',
        maker: 'Anthropic',
        models: ['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'],
        tags: ['Reasoning', 'Tool use', '1M context'],
      },
      {
        name: 'GPT',
        maker: 'OpenAI',
        models: ['gpt-6.1-sol', 'gpt-6-astra', 'gpt-6-luna', 'gpt-5.5'],
        tags: ['Reasoning', 'Vision', '1M context'],
      },
      {
        name: 'Gemini',
        maker: 'Google',
        models: ['gemini-3.1-pro', 'gemini-3.5-flash', 'gemini-3-flash'],
        tags: ['Reasoning', 'Audio', '1M context'],
      },
      {
        name: 'Grok',
        maker: 'xAI',
        models: ['grok-4.7', 'grok-4.6', 'grok-4.5'],
        tags: ['Reasoning', 'Vision', '500K context'],
      },
      {
        name: 'DeepSeek',
        maker: 'DeepSeek',
        models: ['deepseek-v4-pro', 'deepseek-v4.1-flash', 'deepseek-v4-flash'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'Qwen',
        maker: 'Alibaba',
        models: ['qwen3.8-max', 'qwen3.8-flash', 'qwen3.7-plus', 'qwen3.8-omni-flash'],
        tags: ['Reasoning', 'Omni-modal', '1M context'],
      },
      {
        name: 'GLM',
        maker: 'Zhipu',
        models: ['glm-5.3', 'glm-5.3-flash', 'glm-5.2'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'Kimi',
        maker: 'Moonshot AI',
        models: ['kimi-k3', 'kimi-k2.7', 'kimi-k2.6'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'MiniMax',
        maker: 'MiniMax',
        models: ['MiniMax-M3', 'MiniMax-M3-highspeed', 'MiniMax-M2.7'],
        tags: ['Reasoning', 'High-speed', '1M context'],
      },
      {
        name: 'Doubao Seed',
        maker: 'ByteDance',
        models: ['doubao-seed-2.1-turbo', 'doubao-seed-2.0-pro', 'doubao-seed-2.0-code'],
        tags: ['Reasoning', 'Coding', 'Vision'],
      },
      {
        name: 'MiMo',
        maker: 'Xiaomi',
        models: ['mimo-v2.6-pro', 'mimo-v2.5-pro', 'mimo-v2.5'],
        tags: ['Reasoning', 'Audio', 'Open weights'],
      },
      {
        name: 'Image and video',
        maker: 'OpenAI · Google · ByteDance',
        models: ['gpt-image-2', 'gemini-3-pro-image-preview', 'gemini-3.1-flash-image-preview', 'doubao-seedance-2.5'],
        tags: ['Text to image', 'Image editing', 'Video'],
      },
    ],
    note: 'Models follow upstream releases; the catalog is the reference for availability and prices.',
  },
};

type Endpoint = { name: string; path: string; scope: string };
type Access = {
  title: string;
  baseLabel: string;
  endpoints: Endpoint[];
  toolsLabel: string;
  tools: string[];
  toolsNote: string;
  billingTitle: string;
  billing: [string, string][];
  links: { label: string; url: string }[];
};

export const modelAccess: Record<Lang, Access> = {
  zh: {
    title: '接入与计费',
    baseLabel: '接入地址',
    endpoints: [
      { name: 'OpenAI 兼容', path: 'POST /v1/chat/completions', scope: '全部文本模型' },
      { name: 'Anthropic', path: 'POST /v1/messages', scope: 'Claude、Gemini、DeepSeek 等，以模型广场标注为准' },
      { name: 'Gemini', path: 'POST /v1beta/models/{model}:generateContent', scope: 'Gemini 图片模型' },
      { name: '图片生成', path: 'POST /v1/images/generations', scope: 'gpt-image 系列' },
    ],
    toolsLabel: '常用工具',
    tools: ['Codex', 'Claude Code', 'OpenClaw', 'Hermes'],
    toolsNote: '各工具的部署指南',
    billingTitle: '计费方式',
    billing: [
      ['文本模型', '按百万 tokens 计，输入、输出、缓存读、缓存写分开计价'],
      ['图片模型', '按次计费'],
      ['余额与用量', '余额查询页实时查看，控制台有逐次调用日志'],
      ['企业用量', '月结与价格单独洽谈'],
    ],
    links: [
      { label: '模型广场实时价格', url: modelLinks.catalog },
      { label: '余额查询', url: modelLinks.quota },
      { label: '开发者文档', url: modelLinks.docs },
    ],
  },
  en: {
    title: 'Access & billing',
    baseLabel: 'Base URL',
    endpoints: [
      { name: 'OpenAI-compatible', path: 'POST /v1/chat/completions', scope: 'All text models' },
      { name: 'Anthropic', path: 'POST /v1/messages', scope: 'Claude, Gemini, DeepSeek and others; see the catalog' },
      { name: 'Gemini', path: 'POST /v1beta/models/{model}:generateContent', scope: 'Gemini image models' },
      { name: 'Images', path: 'POST /v1/images/generations', scope: 'gpt-image models' },
    ],
    toolsLabel: 'Works with',
    tools: ['Codex', 'Claude Code', 'OpenClaw', 'Hermes'],
    toolsNote: 'Setup guides (in Chinese)',
    billingTitle: 'Billing',
    billing: [
      ['Text models', 'Per million tokens; input, output, cache reads and cache writes priced separately'],
      ['Image models', 'Per request'],
      ['Balance and usage', 'Live on the balance page; the console logs every call'],
      ['Enterprise volume', 'Monthly billing and pricing agreed separately'],
    ],
    links: [
      { label: 'Live prices in the catalog', url: modelLinks.catalog },
      { label: 'Balance', url: modelLinks.quota },
      { label: 'Developer docs', url: modelLinks.docs },
    ],
  },
};

type Way = { name: string; who: string; lines: string[]; action: { label: string; url?: string } };

export const modelPartners: Record<Lang, { title: string; ways: Way[] }> = {
  zh: {
    title: '合作方式',
    ways: [
      {
        name: '自助接入',
        who: '个人开发者与小团队',
        lines: ['注册后在控制台创建 API Key', '按实际用量扣费，模型广场标明单价', '余额与调用日志随时可查'],
        action: { label: '打开控制台', url: modelLinks.account },
      },
      {
        name: '企业用量',
        who: '调用量稳定增长的企业',
        lines: ['用量与价格单独洽谈', '按月结算并对账', '约定异常联络人与模型变更通知'],
        action: { label: '企业用量咨询' },
      },
      {
        name: '分销合作',
        who: '有客户渠道的个人或机构',
        lines: [
          '在线申请，审核通过后获得邀请码与注册链接',
          '按下游用户的实际消耗分档返佣',
          '每月结算，返佣直接计入钱包余额',
        ],
        action: { label: '申请成为分销商', url: modelLinks.agent },
      },
    ],
  },
  en: {
    title: 'Ways to work with us',
    ways: [
      {
        name: 'Self-serve',
        who: 'Developers and small teams',
        lines: [
          'Sign up and create an API key in the console',
          'Pay for what you use; the catalog lists unit prices',
          'Balance and call logs are always available',
        ],
        action: { label: 'Open the console', url: modelLinks.account },
      },
      {
        name: 'Enterprise volume',
        who: 'Companies with steady, growing usage',
        lines: [
          'Volume and pricing agreed separately',
          'Monthly billing and reconciliation',
          'Agreed contacts and notice of model changes',
        ],
        action: { label: 'Enterprise usage' },
      },
      {
        name: 'Referral partners',
        who: 'People or firms with customers to refer',
        lines: [
          'Apply online; approval brings an invite code and sign-up link',
          'Tiered commission on referred users’ actual usage',
          'Settled monthly and paid into your wallet balance',
        ],
        action: { label: 'Apply as a partner', url: modelLinks.agent },
      },
    ],
  },
};
