---
title: OAuth Connect
description: Connect a consumer Claude client — Claude Desktop or the claude.ai connector — to Orcha over OAuth, with no pasted token. Orcha is its own authorization server, with a consent screen and revocable connected apps.
---

:::tip[The principle]
No third-party login, no pasted token. Orcha is its own authorization server, so connecting a consumer client is a single browser approval — and you can cut it off again just as fast.
:::

Some clients — **Claude Desktop** and the **claude.ai connector** — don't take a pasted token. They connect over OAuth: the client opens a browser to Orcha, you approve once on a consent screen, and no token is ever shown or stored by hand. This page is for those clients. For Claude Code, Cursor, and scripts, use a [Personal Access Token](/mcp-server/) instead.

## Connect a client

Add Orcha as a **custom connector** pointing at the MCP endpoint, with **no** `Authorization` header:

```
https://api.orcha.run/mcp
```

- **Claude Desktop:** Settings → Connectors → Add custom connector.
- **claude.ai:** Settings → Connectors → Add custom connector.

Self-hosting? Use your own domain's `/api/mcp` path.

## What happens

Orcha is its **own** authorization server — there is no external identity provider in the path. The client discovers Orcha from the endpoint, registers itself, and opens a browser to Orcha, where you:

1. **Sign in** to Orcha (if you aren't already).
2. On the **consent screen**, choose which **organization / Role** the app acts as — a Role is your membership in one org, so this also pins the tenant — and choose **read** or **read + write** access.
3. **Approve.** The client connects; no token is ever shown or pasted.

## Scopes

An OAuth grant carries one of two scopes:

- **`read`** — every read tool, refused on every write.
- **`read write`** — read tools plus the write and transition tools.

`write` always implies `read` — you can't write a ticket you can't read. A `read` grant maps onto exactly the same capability a **read-only** Personal Access Token has, enforced by the same check. Choosing `read` on the consent screen is the safe default for a client you only want to observe your workspace.

## Connected apps

Every approval becomes a **connected app** — one grant binding one Role and one scope. Review and revoke them from the **avatar menu → Connected Apps**. Revoking a connected app cuts its access immediately, killing both its active tokens and its refresh tokens at once; the client must be re-approved to reconnect.

## HTTPS is required

:::caution[OAuth needs HTTPS]
The authorization server refuses a non-HTTPS issuer (except on `localhost`), so consumer OAuth clients only work once Orcha is served over TLS. On the hosted service this is already the case. Self-hosting behind plain HTTP? Use a [Personal Access Token](/mcp-server/) instead — or terminate TLS (the default Traefik setup in the [self-hosting guide](/self-hosting/) does this for you).
:::

## The "why"

The full model — Orcha as its own authorization server, opaque tokens hashed at rest, PKCE with refresh-token rotation, and the alternatives that were rejected — is in [ADR 0009](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0009-oauth-2.1-orcha-as-its-own-authorization-server.md).
