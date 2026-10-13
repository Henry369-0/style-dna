<div align="center">
  <img src="public/logo-mark.svg" width="72" alt="Style DNA logo" />

# Style DNA

**看懂风格 · 理解体系 · 复用 DNA**

把视觉灵感变成可复用的设计语言。

[快速开始](#快速开始) · [产品说明](docs/PRODUCT.md) · [架构](docs/ARCHITECTURE.md) · [协议](docs/STYLE_DNA_PROTOCOL.md)

<p>
  <img src="https://img.shields.io/badge/license-MIT-1b201d.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/Next.js-16-1b201d.svg" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/multimodal-vision-c9ff48.svg" alt="Multimodal vision" />
  <img src="https://img.shields.io/badge/demo-no%20API%20key-e4ddd0.svg" alt="Demo does not need API key" />
</p>
</div>

<p align="center">
  <img src="docs/assets/cover.svg" alt="Style DNA 项目封面" width="100%" />
</p>

<p align="center">
  <img src="docs/assets/demo.gif" alt="Style DNA 可视化演示" width="100%" />
</p>

## 要解决的问题

人们往往很擅长**判断**视觉质量，却不擅长**描述**它。

> “我就喜欢这个感觉。”  
> “能不能做得更像这个？”  
> “间距、颜色和字体都很对——但我就是说不清为什么。”

这些是真实存在的偏好，但作为生产指令太模糊了。

Style DNA 把一张参考图变成一份可复用的视觉规范：

```text
参考图片
      ↓
内容 ≠ 风格
      ↓
构成 · 色彩 · 字体 · 质感 · 层级 · 情绪 · 避免清单
      ↓
风格 DNA
      ↓
人可读的 Brief · JSON · AI 可直接使用的 Prompt
```

重点**不是**复制参考图，而是提取出“让这张图看起来是这种感觉”的规则。

---

## 视觉图鉴 —— 无需 API key

仓库内置了三张风格迥异的示例图，未配置任何模型之前就可以完整体验产品。

<table>
  <tr>
    <td width="33%"><img src="public/demo/editorial-poster.svg" alt="Quiet Editorial 示例" /></td>
    <td width="33%"><img src="public/demo/nordic-data.svg" alt="Nordic Data Minimal 示例" /></td>
    <td width="33%"><img src="public/demo/soft-tech.svg" alt="Soft Tech Blue 示例" /></td>
  </tr>
  <tr>
    <td><b>Quiet Editorial</b><br/><sub>温暖的印刷克制</sub></td>
    <td><b>Nordic Data Minimal</b><br/><sub>理性而不冰冷</sub></td>
    <td><b>Soft Tech Blue</b><br/><sub>没有视觉噪音的层次感</sub></td>
  </tr>
</table>

每个示例走的是**同一套分析协议**，产出的却是不同的风格 DNA。这就是产品的检验标准：协议应该能泛化到海报、看板、界面等不同媒介，而不是只记住某一种审美。

---

## Style DNA 会返回什么

### 1. 风格快照（Style Snapshot）

五秒钟读懂一张图：

```text
编辑风 · 暖中性 · 非对称 · 高留白 · 克制点缀色
```

### 2. 可执行的视觉规则

不是停在 `极简` 或 `高级感` 这种标签上，而是给出类似这样的可执行描述：

- 非对称编辑网格；
- 强左对齐；
- 高外部留白；
- 低饱和暖中性色板；
- 一个克制的点缀色角色；
- 超大衬线标题 / 紧凑无衬线正文的层级；
- 细微的哑光纸纹质感；
- 柔和的图像对比度；
- 低装饰密度。

### 3. 为什么它好看（Why It Works）

情绪与可见的证据绑定。例如“平静”不是空标签——它可能由高留白、柔和对比、低饱和来解释。

### 4. 反向风格 DNA（Negative Style DNA）

分析器同时生成**不要加什么**：

```text
避免霓虹色
避免厚重渐变
避免塑料感 3D
避免过度锐化
避免超大高光卡片
```

### 5. 可移植的输出

- 人可读的视觉 Brief；
- 结构化 JSON；
- AI 可直接使用的 Prompt，明确保留新内容、只迁移风格。

---

## 工作原理

<p align="center">
  <img src="docs/assets/architecture.svg" alt="Style DNA 架构图" width="100%" />
</p>

产品刻意把「测量」和「判断」分开：

**浏览器端代码处理确定的事实：**

- 原始尺寸；
- 宽高比；
- 粗粒度主色板；
- 上传校验；
- 送入模型前的缩放 / 压缩。

**视觉推理负责抽象的视觉关系：**

- 媒介类型；
- 内容 / 风格分离；
- 构成与空间节奏；
- 字体性格；
- 质感与图像处理；
- 层级与情绪；
- 反向约束；
- 解释为什么这样设计是成立的。

> **模型只是能力，协议 + 规范 + 确定性的预处理才是产品层。**

---

## 内容 ≠ 风格

如果参考图里有东京塔、一辆出租车和一个黄色标题，Style DNA **不会**把这些具体对象当作可复用的视觉规则。

| 内容 | 风格 |
| --- | --- |
| 东京塔 | 非对称构图 |
| 出租车 | 克制的点缀色 |
| 字面标题 | 超大衬线层级 |
| 街景 | 低饱和的图像处理 |
| 具体 logo | 高负空间 |

这个分离很重要，因为下一份内容可能是演示文稿、数据看板，或者另一座完全不同的城市。

---

## 跨媒介迁移

<p align="center">
  <img src="docs/assets/translation.svg" alt="Style DNA 跨媒介迁移示意" width="100%" />
</p>

风格迁移不等于像素克隆。

一条海报规则可以按媒介重新演绎：

- 纸张颗粒 → 网页上微妙的背景纹理；
- 编辑字体层级 → 演示文稿的标题 / 正文层级；
- 克制的芥末黄点缀 → 图表里唯一的高亮数据点；
- 非对称印刷构图 → 错落但安全的落地页网格。

**规则在迁移，字面的参考图不会。**

---

## MVP 范围

### 已包含

- [x] 拖拽上传图片
- [x] JPG / PNG / WebP 校验
- [x] 浏览器端分析前缩放
- [x] 尺寸 + 宽高比提取
- [x] 确定性的粗粒度色板提取
- [x] 多模态媒介类型识别
- [x] 内容 / 风格分离
- [x] 风格快照（Style Snapshot）
- [x] 构成与留白分析
- [x] 色彩体系
- [x] 字体性格 + 置信度
- [x] 质感与图像处理
- [x] 视觉层级
- [x] 带视觉依据的情绪
- [x] 为什么它好看（Why It Works）
- [x] 反向风格 DNA / 避免清单
- [x] 复制结构化 DNA
- [x] 导出 JSON
- [x] 生成可复用的风格 Prompt
- [x] 三个内置视觉示例
- [x] 跨媒介迁移画廊
- [x] 共享 JSON Schema
- [x] Skill 草稿
- [x] CI 校验

### 暂不包含

- 账号体系；
- 云端保存；
- 社区 / 信息流；
- 风格市场；
- 自动生图；
- 对比 / 融合（Compare / Blend）；
- 完整图像编辑；
- 训练或微调自定义模型。

---

## 快速开始

需要 **Node.js 20+**（CI 使用 Node 22）。

### 1. 安装

```bash
npm install
```

### 2. 配置真实分析

```bash
cp .env.example .env.local
```

填入服务端密钥：

```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-5.6-terra
```

### 3. 启动

```bash
npm run dev
```

打开 `http://localhost:3000`。

还没有 key？三个内置示例依然提供完整的结果 / 导出体验。

### 质量检查

```bash
npm run validate
npm run lint
npm run build
```

启动本地服务后，如果已安装 Playwright CLI，可用独立会话验证图片切换、失败上传和手机宽度，无需模型密钥：

```sh
playwright-cli -s=style-dna-check open http://localhost:3000
playwright-cli -s=style-dna-check run-code --filename=tests/reference-lifecycle.browser.js
```

该回归使用生成的测试图片与 mock 分析响应；它检查 UI 中图片和结果的一致性，不评估真实视觉模型的分析质量。

---

## 仓库结构

```text
style-dna/
├── app/
│   ├── api/analyze/route.ts       # 服务端多模态分析
│   ├── globals.css                # 编辑风视觉系统
│   ├── layout.tsx
│   └── page.tsx                   # 上传、图鉴、迁移、结果
├── public/
│   ├── demo/                      # 内置视觉参考图
│   ├── translation/               # 跨媒介示例
│   ├── logo-mark.svg
│   └── icon.svg
├── lib/
│   ├── demo.ts                    # 内置 Style DNA 示例
│   ├── prompt.ts                  # AI 风格 Prompt 生成器
│   └── types.ts
├── schemas/
│   └── style_dna.schema.json      # 权威机器可读契约
├── prompts/
│   └── style-analysis.md          # 可复用的分析协议
├── skill/
│   └── SKILL.md                   # Agent / Skill 草稿
├── examples/                      # 精简示例输出
├── docs/
│   ├── assets/                    # README 配图
│   ├── PRODUCT.md
│   ├── ARCHITECTURE.md
│   ├── STYLE_DNA_PROTOCOL.md
│   └── DEPLOYMENT.md
├── scripts/validate.mjs
├── AGENTS.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
```

---

## Style DNA 契约

权威规范位于 [`schemas/style_dna.schema.json`](schemas/style_dna.schema.json)。

一个精简示例：

```json
{
  "style_name": "Quiet Editorial",
  "media_type": "Poster",
  "snapshot": [
    "Editorial",
    "Warm neutral",
    "Asymmetric",
    "High whitespace",
    "Restrained accent"
  ],
  "composition": {
    "structure": "Asymmetric editorial grid",
    "whitespace": "High — large outer margins"
  },
  "color": {
    "strategy": "Warm ivory field + muted navy + one mustard accent",
    "palette": ["#F2EEE5", "#243447", "#7A838A", "#C5A04B"]
  },
  "avoid": [
    "Neon colors",
    "Heavy gradients",
    "Plastic 3D"
  ]
}
```

Schema 之所以重要，是因为视觉理解只有在拥有稳定表示之后，才能往返于 Web 应用、Prompt 管线、Agent Skill 或未来的 API 之间。

---

## 产品原则

### 规则 > 标签

`极简` 是弱输出。`高留白 + 有限色板 + 强对齐 + 低装饰密度` 才是可执行的。

### 置信度 > 虚假精确

字体用性格与层级来描述，而不是凭空捏造一个具体字体名。

### 迁移 > 克隆

长期目标是跨媒介诠释，而不是复制参考图的像素。

### 视觉产品，视觉 README

一个关于设计的项目，不该只用成片的文字解释自己。仓库因此把真实视觉参考、视觉图鉴、跨媒介示例和图解资源都作为产品表面的一部分。

---

## 路线图

```text
V1  参考图 → Style DNA
V2  DNA → 针对 图像 / 演示 / 网页 / 图表 的优化 Prompt
V3  参考图 → DNA → 新内容 → 应用
V4  风格库 / 对比 / 融合
V5  Skill + API + 更丰富的跨媒介迁移
```

---

## 一句话版本

> 人们往往擅长判断一个设计好不好看，却不擅长用专业语言描述审美。我做 Style DNA 是为了把参考图的内容与视觉系统分离开，再把构图、色彩、字体、留白、质感与层级翻译成结构化、可复用的规则。重点不是图像识别，而是把一次性的视觉印象，变成可以在图像、演示文稿、网站和数据可视化之间复用的资产。

## License

MIT
