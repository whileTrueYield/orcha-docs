---
title: MCP Server
description: Connect a coding agent like Claude Code or Cursor to your Orcha workspace over the Model Context Protocol — a curated set of read and write tools, authenticated with a Personal Access Token.
---

:::tip[The principle]
Give an agent just enough to orient itself and move work forward — no more. The MCP server is a curated subset of Orcha, not a mirror of every operation, so the agent's choices stay legible and its blast radius stays small.
:::

The **Orcha MCP Server** is a [Model Context Protocol](https://modelcontextprotocol.io) endpoint at `/mcp`. It lets a coding agent ask "who am I?" and "what should I work on next?", then act on the answer — creating, updating, and transitioning tickets and editing their Markdown bodies.

This page covers connecting with a **Personal Access Token**, which is the right choice for coding agents like Claude Code and Cursor. For consumer clients like Claude Desktop and the claude.ai connector, see [OAuth Connect](/oauth-connect/) instead.

## Connect with a Personal Access Token

Mint a token in the app from the **avatar menu → API Tokens**, then point your MCP client at the endpoint with the token in an `Authorization` header. For a Claude Code / Cursor-style `mcp.json`:

```json
{
  "mcpServers": {
    "orcha": {
      "type": "http",
      "url": "https://api.orcha.run/mcp",
      "headers": {
        "Authorization": "Bearer orcha_pat_your_token_here"
      }
    }
  }
}
```

Self-hosting? Swap the host for your own domain — the endpoint is your backend's `/api/mcp` path.

Every tool is tenant-scoped to the connection's Role and returns LLM-shaped flat JSON. A **read-only** connection can call every read tool but is refused on the writes. The connection is refused outright if its credential is missing, malformed, or invalid.

## The tools

### Read — orient and understand the work

- **`whoami`** — your role, the user and organization you act for, and whether your token is read-only.
- **`next_tickets`** — your work queue in scheduler priority order, each ticket paired with the next workflow state to advance it into.
- **`list_tickets`** — find tickets by project, status, stage, assignee, or search, paginated.
- **`get_ticket`** — a single ticket's full detail: estimate/ETA, workflow states with three-point estimates, dependency edges, and the Markdown body.
- **`get_ticket_body`** / **`get_project_body`** — just the Markdown body and its version (the version a later body write conditions on).
- **`list_projects`** — find projects by search or parent, paginated.
- **`get_project`** — a single project's detail and its parent/children edges.
- **`get_schedule`** — your outstanding scheduled work and its ETAs.

### Write — act on what it finds

- **`create_ticket`** / **`update_ticket`** — capture a new ticket, or patch an existing one's fields. `create_ticket` can fully form a ticket in one call — seed its Markdown `body` and assign an `ownerId` alongside the title, sparing follow-up writes — and every ticket it returns carries a direct `url` you can hand the user to open it.
- **`transition_ticket`** — drive a ticket through its lifecycle: schedule it, start a workflow stage, advance to the next stage, or close / cancel it.
- **`update_ticket_body`** / **`update_project_body`** — write the Markdown body with optimistic concurrency: the write conditions on the version you read, and a concurrent edit comes back as a conflict to rebase on — never a silent overwrite.

## How it's served

The MCP server runs inside the Orcha backend and shares the same execution path as the [REST API](/rest-api/) — so the two never disagree about what an operation does. It is stateless [Streamable HTTP](https://modelcontextprotocol.io/specification): there is no session to keep alive, each request carries its own credential.

The full architecture — why the MCP server lives in the backend and reuses the `/v1` executor — is in [ADR 0008](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0008-mcp-server-in-backend-sharing-the-v1-executor.md).
