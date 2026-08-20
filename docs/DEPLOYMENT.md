# 部署

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

设置 `OPENAI_API_KEY` 即可启用真实图像分析。没有 key 时，所有内置示例依然可用。

## 生产环境 Node

```bash
npm install
npm run build
npm start
```

在服务器上配置相同的环境变量。

## Vercel

本仓库是标准的 Next.js 应用，分析逻辑在 `app/api/analyze/route.ts` 这个服务端路由里，因此可以像普通 Next.js 项目一样部署。在服务端环境变量中添加 `OPENAI_API_KEY` 和可选的 `OPENAI_MODEL`。

## 静态托管说明

完整产品不是纯静态站点，因为真实分析需要一个服务端 API 路由来保护模型密钥。如果你只需要静态的作品集构建，可以把内置的 SVG 参考图和 demo JSON 当作体验层，但**不要把 API key 放进客户端代码**。
