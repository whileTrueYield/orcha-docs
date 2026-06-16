---
title: REST API
description: The Orcha public REST API — a thin, versioned /v1 surface over the same operations the app uses, authenticated with a Personal Access Token and described by a published OpenAPI spec.
---

:::tip[The principle]
The `/v1` surface is the promise we make to integrators. It is deliberately small and hand-curated — not a mechanical dump of the internal schema — so what you see is what we commit to keeping stable.
:::

The **Orcha REST API** is a thin, versioned HTTP contract at `/v1`. Internally it executes the same operations as the app's own GraphQL API, but it presents them as a small, stable REST surface for external clients.

## Base URL

On Orcha's hosted service:

```
https://api.orcha.run/v1
```

Self-hosting? Substitute your own domain — the API lives under your backend's `/api` path (for example `https://your-domain.com/api/v1`), because the reverse proxy routes `/api` to the backend.

## Authenticate

Every request is authenticated with a **Personal Access Token** in an `Authorization` header. Mint one in the app from the **avatar menu → API Tokens**.

```sh
curl https://api.orcha.run/v1/me \
  -H "Authorization: Bearer orcha_pat_your_token_here"
```

A token is bound to a single Role, so the request is automatically scoped to that Role's organization — there is nothing else to pass. A token may be **read-only**: it can call every `GET` endpoint but is refused on writes.

## Endpoints

| Method | Path | What it does |
|--------|------|--------------|
| `GET` | `/v1/me` | The identity and organization the token acts as |
| `GET` | `/v1/me/next-tickets` | Your work queue, in scheduler priority order |
| `GET` | `/v1/tickets` | List tickets (filter + paginate) |
| `POST` | `/v1/tickets` | Create a ticket |
| `GET` | `/v1/tickets/{id}` | A single ticket's full detail |
| `PATCH` | `/v1/tickets/{id}` | Update a ticket's fields (partial) |
| `POST` | `/v1/tickets/{id}/transition` | Move a ticket through its lifecycle |
| `GET` | `/v1/tickets/{id}/body` | Read a ticket's Markdown body + version |
| `PUT` | `/v1/tickets/{id}/body` | Write a ticket's Markdown body |
| `GET` | `/v1/projects` | List projects (filter + paginate) |
| `GET` | `/v1/projects/{id}` | A single project's detail |
| `GET` | `/v1/projects/{id}/body` | Read a project's Markdown body + version |
| `PUT` | `/v1/projects/{id}/body` | Write a project's Markdown body |
| `GET` | `/v1/schedule` | Your outstanding scheduled work and ETAs |

The lifecycle `action` on a transition is one of `schedule`, `start`, `advance`, `close`, or `cancel`. Body writes use **optimistic concurrency**: a write conditions on the version you read, and a concurrent edit comes back as a conflict to rebase on rather than a silent overwrite.

:::note[The machine-readable contract]
The authoritative, always-current per-endpoint reference — parameters, request and response shapes — is the published [OpenAPI 3.1](https://spec.openapis.org/oas/v3.1.0.html) spec, served by your instance:

```
GET https://api.orcha.run/v1/openapi.json
```

Point your favourite OpenAPI tooling (client generator, Postman, Bruno) at it. We keep the spec and the API in lockstep, so it never drifts from what the server actually does.
:::

## Pagination

List endpoints return a `pageInfo` object with cursor metadata. `nextCursor` is an opaque token; pass it back as `?after=` to fetch the next page. It is `null` on the last page.

## Errors

Errors come back as JSON with a stable shape:

```json
{ "error": { "code": "UNAUTHENTICATED", "message": "…" } }
```

The `code` is a stable machine-readable string; the `message` is for humans.

## Rate limits

Every endpoint shares a **per-token** rate limit. When you exceed it you get `429 Too Many Requests` with a `Retry-After` header giving the seconds to wait before the window resets.

## The "why"

The full reasoning — why thin REST over GraphQL, why role-scoped tokens, why a hand-authored spec — is in [ADR 0006](https://github.com/whileTrueYield/orcha/blob/main/docs/adr/0006-external-api-thin-rest-over-graphql-with-role-scoped-tokens.md).
