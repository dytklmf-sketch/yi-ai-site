import type { Lang } from './yi-ai';

/**
 * Round 48: the model services page in as much detail as WorkBuddy's. Models come from the public catalog at
 * https://ccg-cli.online/models/ (`/api/shop/models/pricing`): only each family's main models, without channel
 * variants. Prices stay on the catalog (the owner's call); this page explains how billing works.
 */
// `icon` is the vendor's logo in public/models/ (round 51): SVGs from @lobehub/icons-static-svg 1.95.1 (MIT,
// github.com/lobehub/lobe-icons), unmodified; the logos are their owners' trademarks and only say whose model a card
// lists. `mark` is the fallback monogram (round 50): used for MiMo, which only has a wordmark, or if a logo has to
// come down. `color` tints the card.
type Family = {
  name: string;
  maker?: string;
  region: string;
  icon?: string;
  mark: string;
  color: string;
  models: string[];
  tags: string[];
};
type Catalog = {
  label: string;
  title: [string, string];
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
    families: [
      {
        name: 'Claude',
        maker: 'Anthropic',
        region: '国际',
        icon: 'claude-color.svg',
        mark: 'A',
        color: '#b4532a',
        models: ['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'],
        tags: ['推理', '工具调用', '1M 上下文'],
      },
      {
        name: 'GPT',
        maker: 'OpenAI',
        region: '国际',
        icon: 'openai.svg',
        mark: 'O',
        color: '#0b7a5f',
        models: ['gpt-6.1-sol', 'gpt-6-astra', 'gpt-6-luna', 'gpt-5.5'],
        tags: ['推理', '视觉', '1M 上下文'],
      },
      {
        name: 'Gemini',
        maker: 'Google',
        region: '国际',
        icon: 'gemini-color.svg',
        mark: 'G',
        color: '#3b5bdb',
        models: ['gemini-3.1-pro', 'gemini-3.5-flash', 'gemini-3-flash'],
        tags: ['推理', '音频', '1M 上下文'],
      },
      {
        name: 'Grok',
        maker: 'xAI',
        region: '国际',
        icon: 'grok.svg',
        mark: 'x',
        color: '#1f2937',
        models: ['grok-4.7', 'grok-4.6', 'grok-4.5'],
        tags: ['推理', '视觉', '500K 上下文'],
      },
      {
        name: 'DeepSeek',
        maker: '深度求索',
        region: '国产',
        icon: 'deepseek-color.svg',
        mark: 'D',
        color: '#3651d4',
        models: ['deepseek-v4-pro', 'deepseek-v4.1-flash', 'deepseek-v4-flash'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: '通义千问',
        maker: '阿里巴巴',
        region: '国产',
        icon: 'qwen-color.svg',
        mark: 'Q',
        color: '#5b47d6',
        models: ['qwen3.8-max', 'qwen3.8-flash', 'qwen3.7-plus', 'qwen3.8-omni-flash'],
        tags: ['推理', '全模态', '1M 上下文'],
      },
      {
        name: 'GLM',
        maker: '智谱',
        region: '国产',
        icon: 'zhipu-color.svg',
        mark: 'Z',
        color: '#1e56c7',
        models: ['glm-5.3', 'glm-5.3-flash', 'glm-5.2'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: 'Kimi',
        maker: '月之暗面',
        region: '国产',
        icon: 'kimi.svg',
        mark: 'K',
        color: '#18181b',
        models: ['kimi-k3', 'kimi-k2.7', 'kimi-k2.6'],
        tags: ['推理', '开放权重', '1M 上下文'],
      },
      {
        name: 'MiniMax',
        maker: 'MiniMax',
        region: '国产',
        icon: 'minimax-color.svg',
        mark: 'M',
        color: '#c2185b',
        models: ['MiniMax-M3', 'MiniMax-M3-highspeed', 'MiniMax-M2.7'],
        tags: ['推理', '高速版', '1M 上下文'],
      },
      {
        name: '豆包 Seed',
        maker: '字节跳动',
        region: '国产',
        icon: 'doubao-color.svg',
        mark: '豆',
        color: '#1f5fd6',
        models: ['doubao-seed-2.1-turbo', 'doubao-seed-2.0-pro', 'doubao-seed-2.0-code'],
        tags: ['推理', '编程', '视觉'],
      },
      {
        name: 'MiMo',
        maker: '小米',
        region: '国产',
        mark: 'Mi',
        color: '#c2410c',
        models: ['mimo-v2.6-pro', 'mimo-v2.5-pro', 'mimo-v2.5'],
        tags: ['推理', '音频', '开放权重'],
      },
      {
        name: '图片与视频',
        region: '多模态',
        mark: '',
        color: '#8e2fbf',
        models: ['gpt-image-2', 'gemini-3-pro-image-preview', 'doubao-seedance-2.5'],
        tags: ['文生图', '图片编辑', '视频生成'],
      },
    ],
    note: '完整列表与实时价格见模型广场',
  },
  en: {
    label: 'Models',
    title: ['CCG API models', 'One key for the leading models'],
    families: [
      {
        name: 'Claude',
        maker: 'Anthropic',
        region: 'International',
        icon: 'claude-color.svg',
        mark: 'A',
        color: '#b4532a',
        models: ['claude-opus-5-5', 'claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5'],
        tags: ['Reasoning', 'Tool use', '1M context'],
      },
      {
        name: 'GPT',
        maker: 'OpenAI',
        region: 'International',
        icon: 'openai.svg',
        mark: 'O',
        color: '#0b7a5f',
        models: ['gpt-6.1-sol', 'gpt-6-astra', 'gpt-6-luna', 'gpt-5.5'],
        tags: ['Reasoning', 'Vision', '1M context'],
      },
      {
        name: 'Gemini',
        maker: 'Google',
        region: 'International',
        icon: 'gemini-color.svg',
        mark: 'G',
        color: '#3b5bdb',
        models: ['gemini-3.1-pro', 'gemini-3.5-flash', 'gemini-3-flash'],
        tags: ['Reasoning', 'Audio', '1M context'],
      },
      {
        name: 'Grok',
        maker: 'xAI',
        region: 'International',
        icon: 'grok.svg',
        mark: 'x',
        color: '#1f2937',
        models: ['grok-4.7', 'grok-4.6', 'grok-4.5'],
        tags: ['Reasoning', 'Vision', '500K context'],
      },
      {
        name: 'DeepSeek',
        maker: 'DeepSeek',
        region: 'China',
        icon: 'deepseek-color.svg',
        mark: 'D',
        color: '#3651d4',
        models: ['deepseek-v4-pro', 'deepseek-v4.1-flash', 'deepseek-v4-flash'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'Qwen',
        maker: 'Alibaba',
        region: 'China',
        icon: 'qwen-color.svg',
        mark: 'Q',
        color: '#5b47d6',
        models: ['qwen3.8-max', 'qwen3.8-flash', 'qwen3.7-plus', 'qwen3.8-omni-flash'],
        tags: ['Reasoning', 'Omni-modal', '1M context'],
      },
      {
        name: 'GLM',
        maker: 'Zhipu',
        region: 'China',
        icon: 'zhipu-color.svg',
        mark: 'Z',
        color: '#1e56c7',
        models: ['glm-5.3', 'glm-5.3-flash', 'glm-5.2'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'Kimi',
        maker: 'Moonshot AI',
        region: 'China',
        icon: 'kimi.svg',
        mark: 'K',
        color: '#18181b',
        models: ['kimi-k3', 'kimi-k2.7', 'kimi-k2.6'],
        tags: ['Reasoning', 'Open weights', '1M context'],
      },
      {
        name: 'MiniMax',
        maker: 'MiniMax',
        region: 'China',
        icon: 'minimax-color.svg',
        mark: 'M',
        color: '#c2185b',
        models: ['MiniMax-M3', 'MiniMax-M3-highspeed', 'MiniMax-M2.7'],
        tags: ['Reasoning', 'High-speed', '1M context'],
      },
      {
        name: 'Doubao Seed',
        maker: 'ByteDance',
        region: 'China',
        icon: 'doubao-color.svg',
        mark: 'B',
        color: '#1f5fd6',
        models: ['doubao-seed-2.1-turbo', 'doubao-seed-2.0-pro', 'doubao-seed-2.0-code'],
        tags: ['Reasoning', 'Coding', 'Vision'],
      },
      {
        name: 'MiMo',
        maker: 'Xiaomi',
        region: 'China',
        mark: 'Mi',
        color: '#c2410c',
        models: ['mimo-v2.6-pro', 'mimo-v2.5-pro', 'mimo-v2.5'],
        tags: ['Reasoning', 'Audio', 'Open weights'],
      },
      {
        name: 'Image and video',
        region: 'Multimodal',
        mark: '',
        color: '#8e2fbf',
        models: ['gpt-image-2', 'gemini-3-pro-image-preview', 'doubao-seedance-2.5'],
        tags: ['Text to image', 'Image editing', 'Video'],
      },
    ],
    note: 'Every model and live prices are in the catalog',
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
  formulaLabel: string;
  formula: string;
  links: { label: string; url: string }[];
};

export const modelAccess: Record<Lang, Access> = {
  zh: {
    title: '接入与计费',
    baseLabel: '接入地址',
    endpoints: [
      { name: 'OpenAI Chat', path: '/v1/chat/completions', scope: '全部文本模型，兼容最广' },
      { name: 'OpenAI Responses', path: '/v1/responses', scope: 'GPT 系列，Codex 默认使用' },
      { name: 'Anthropic', path: '/v1/messages', scope: 'Claude、Gemini、DeepSeek 等，以模型广场标注为准' },
      { name: 'Gemini', path: '/v1beta/models/{model}:generateContent', scope: 'Gemini 图片模型' },
      { name: '图片生成', path: '/v1/images/generations', scope: 'gpt-image 系列' },
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
    formulaLabel: '单次调用费用',
    formula: '输入 tokens × 输入单价 + 输出 tokens × 输出单价 + 缓存 tokens × 缓存单价',
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
      { name: 'OpenAI Chat', path: '/v1/chat/completions', scope: 'All text models; the widest support' },
      { name: 'OpenAI Responses', path: '/v1/responses', scope: 'GPT models; what Codex uses' },
      { name: 'Anthropic', path: '/v1/messages', scope: 'Claude, Gemini, DeepSeek and others; see the catalog' },
      { name: 'Gemini', path: '/v1beta/models/{model}:generateContent', scope: 'Gemini image models' },
      { name: 'Images', path: '/v1/images/generations', scope: 'gpt-image models' },
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
    formulaLabel: 'Cost of one call',
    formula: 'input tokens × input price + output tokens × output price + cached tokens × cache price',
    links: [
      { label: 'Live prices in the catalog', url: modelLinks.catalog },
      { label: 'Balance', url: modelLinks.quota },
      { label: 'Developer docs', url: modelLinks.docs },
    ],
  },
};

type Step = { title: string; text: string };
// The enterprise way takes its steps from service-details (the shared process data); the others carry their own.
type Way = { name: string; who: string; steps?: Step[]; action: { label: string; url?: string } };

export const modelWays: Record<Lang, { title: string; ways: Way[] }> = {
  zh: {
    title: '合作方式与流程',
    ways: [
      {
        name: '自助接入',
        who: '个人开发者与小团队',
        steps: [
          { title: '注册账号', text: '在 CCG API 控制台注册。' },
          { title: '开通 Key', text: '开通 API Key 并充值，按实际用量扣费。' },
          { title: '接入调用', text: '把接入地址和 Key 填进代码或工具。' },
        ],
        action: { label: '打开控制台', url: modelLinks.account },
      },
      {
        name: '企业用量',
        who: '调用量稳定增长的企业',
        action: { label: '企业用量咨询' },
      },
      {
        name: '分销合作',
        who: '有客户渠道的个人或机构',
        steps: [
          { title: '提交申请', text: '填写推广渠道与预计规模。' },
          { title: '审核开通', text: '通过后获得邀请码与注册链接。' },
          { title: '按月返佣', text: '按下游实际消耗分档计算，计入钱包余额。' },
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
        steps: [
          { title: 'Sign up', text: 'Register in the CCG API console.' },
          { title: 'Get a key', text: 'Open an API key and top it up; you pay for what you use.' },
          { title: 'Connect', text: 'Put the base URL and key into your code or tools.' },
        ],
        action: { label: 'Open the console', url: modelLinks.account },
      },
      {
        name: 'Enterprise volume',
        who: 'Companies with steady, growing usage',
        action: { label: 'Enterprise usage' },
      },
      {
        name: 'Referral partners',
        who: 'People or firms with customers to refer',
        steps: [
          { title: 'Apply', text: 'Tell us your channels and expected reach.' },
          { title: 'Approval', text: 'Get an invite code and a sign-up link.' },
          { title: 'Monthly commission', text: 'Tiered on referred users’ usage, paid into your wallet.' },
        ],
        action: { label: 'Apply as a partner', url: modelLinks.agent },
      },
    ],
  },
};
