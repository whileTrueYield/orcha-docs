---
title: API & Integrations Overview
description: How external clients reach Orcha — the REST API and MCP server, authenticated over OAuth (preferred) or a Personal Access Token (the alternative), where one credential always maps to one Role and one tenant.
---

:::tip[The principle]
One token, one Role, one tenant. Every external credential resolves to a single Role — your membership in one organization — so identity and tenant scope come for free. There is no separate "which org?" to get wrong.
:::

Orcha exposes two ways for software outside the app to reach your workspace. For the MCP server, **OAuth is the preferred way to connect** — approve once in the browser and the client handles the rest. A **Personal Access Token** is the alternative, for the REST API and for agents that can't run MCP OAuth (or whenever you'd rather hand a client a token).

## Two surfaces

- **[Orcha REST API](/rest-api/)** — a thin, versioned `/v1` HTTP contract for scripts, automation, and your own integrations. You make ordinary HTTP requests and get JSON back.
- **[Orcha MCP Server](/mcp-server/)** — a [Model Context Protocol](https://modelcontextprotocol.io) endpoint at `/mcp` that exposes a curated set of agent-shaped tools, so a coding agent like Claude Code or Cursor can read your workspace and act on it.

The MCP server is not a one-to-one mirror of the REST API. It is a deliberately small, agent-shaped subset — the operations an agent needs to orient itself and move work forward.

## Preferred and alternative

- **[OAuth](/oauth-connect/)** *(preferred)* — ChatGPT, Claude Desktop, claude.ai, and OAuth-capable coding agents like Claude Code and Cursor discover Orcha's OAuth server from the MCP endpoint, open your browser for a one-time approval, and receive tokens from Orcha automatically. You never paste anything; the client stores the tokens and sends them on each request.
- **Personal Access Token** *(the alternative)* — a long-lived token you mint in the app and paste into a client. For the [REST API](/rest-api/), for agents that can't run MCP OAuth (Grok, for one), and any time you'd rather hand a client a token than run the browser flow.

A PAT (and an OAuth grant) can be **read-only**: it can call every read operation but is refused on every write.

## Which do I use?

| I want to… | Surface | Auth |
|------------|---------|------|
| Script against Orcha from my own code | REST API | PAT |
| Connect ChatGPT, Claude Desktop, claude.ai, Claude Code, or Cursor | MCP server | OAuth |
| Connect Grok (or any agent that can't run the browser flow) | MCP server | PAT (alternative) |
| Give a token read-only access | either | read-only PAT, or `read` scope |

## Where this is documented

These pages distill the product's decision records. For the full "why" behind each design:

- [ADR 0006 — thin REST over GraphQL with role-scoped tokens](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0006-external-api-thin-rest-over-graphql-with-role-scoped-tokens.md)
- [ADR 0008 — MCP server in the backend, sharing the `/v1` executor](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0008-mcp-server-in-backend-sharing-the-v1-executor.md)
- [ADR 0009 — OAuth 2.1, Orcha as its own authorization server](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0009-oauth-2.1-orcha-as-its-own-authorization-server.md)
