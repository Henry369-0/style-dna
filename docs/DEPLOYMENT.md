# Deployment

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` to enable real image analysis. Without a key, all bundled examples still work.

## Production Node

```bash
npm install
npm run build
npm start
```

Configure the same environment variables on the server.

## Vercel

This repository is a standard Next.js application with a server route under `app/api/analyze/route.ts`, so it can be deployed as a normal Next.js project. Add `OPENAI_API_KEY` and optionally `OPENAI_MODEL` as server-side environment variables.

## Static hosting note

The full product is not a pure static site because real analysis requires a server-side API route to keep the model key private. If you need a static portfolio-only build, use the bundled SVG references and demo JSON as the experience layer, but do not move the API key into client code.
