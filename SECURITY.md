# Security

## API keys

Never commit `.env`, `.env.local`, model keys or other credentials. The browser must not receive `OPENAI_API_KEY`.

## Request limits

The analysis route rejects oversized or malformed requests before any model call:

- JSON bodies larger than 6 MB are rejected with `413`;
- image data URLs longer than ~5.5 MB are rejected with `413` (the browser already resizes to a 1600px JPEG);
- invalid JSON bodies are rejected with `400`;
- client-supplied metrics are re-validated server-side.

A simple per-instance rate limit (20 requests / 60 s per IP) returns `429` with `Retry-After`. It is a cost guardrail, not a security boundary — on serverless deployments the counter is per-instance, so pair it with platform-level rate limiting for production hardening.

## Uploaded images

The application does not intentionally persist uploaded references. Browser preprocessing produces a resized data URL for analysis and sends it only to the server route handling the request.

## Reporting

If you discover a security issue, avoid publishing sensitive reproduction details in a public issue until the risk can be assessed.
