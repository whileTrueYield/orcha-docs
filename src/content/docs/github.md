---
title: GitHub
description: Mirror your GitHub pull requests onto Orcha tickets. Link a repository once with a signed webhook, name a ticket in a PR's branch or title, and the PR shows up in the ticket's Changes tab — read-only, inbound-only, no GitHub app to install.
---

:::tip[The principle]
One signed webhook per repository, and a ticket ref in the branch name or PR title. Orcha mirrors the pull request onto the ticket — its state, author, and a link out — and never writes back to GitHub.
:::

Orcha's GitHub integration is a **read-only pull-request mirror**. There's no GitHub App to install and no OAuth scopes to grant: you add a single repository webhook, and from then on every pull request that names a ticket appears in that ticket's **Changes** tab. Deliveries flow one way — GitHub → Orcha — so Orcha can never push, comment, or change anything in your repo.

## Link a repository

Repository links live under **Admin → Repository Links** (you need an admin Role in the organization).

1. Click **Link a repository**. Optionally give the link a **label** — it only helps you tell pending links apart before the repo is known; you don't type the repository name.
2. Click **Generate webhook**. Orcha shows you two values **exactly once**:
   - a **Payload URL** — unique to this link, e.g. `https://api.orcha.run/github/webhook/<token>`
   - a **Secret** — the key GitHub signs each delivery with
3. Copy both before closing the dialog. The secret is never stored in a form you can read back — if you lose it, remove the link and create a new one.

:::caution
The secret is revealed once and can't be retrieved again. Paste it into GitHub before you dismiss the dialog.
:::

## Add the webhook in GitHub

In your repository on GitHub, open **Settings → Webhooks → Add webhook** and fill in:

| Field | Value |
|-------|-------|
| **Payload URL** | The Payload URL from Orcha |
| **Content type** | `application/json` |
| **Secret** | The Secret from Orcha |
| **Which events** | **Let me select individual events** → check **Pull requests** only |
| **Active** | ✓ |

Choose **Pull requests** and nothing else. Orcha only acts on pull-request events; **deselect "Pushes"** — push and the per-commit `synchronize` event are ignored, so leaving them on just sends deliveries that do nothing. (Adding a webhook requires repo-admin rights, which is exactly why a valid delivery is enough to prove you control the repo.)

## Activation

A new link starts **Pending** — the row reads *"Awaiting the first webhook delivery."* GitHub sends a `ping` automatically the moment you save the webhook; Orcha verifies its HMAC-SHA256 signature against your secret, records the repository it came from, and flips the link to **Active** (green badge). No extra step is needed — that first ping is the proof.

If the link stays Pending, the delivery didn't verify. Check GitHub's **Recent Deliveries** tab on the webhook: a `401` means the secret or Payload URL is wrong.

Each repository can be held by only one active link. Pending links never reserve a repo, so the first signed delivery wins.

## How a pull request reaches a ticket

Orcha doesn't guess — it reads **ticket refs** out of the pull request. A ticket ref is a product code and the ticket's number, like `BUGS-1` or `INFRA-42`. On every delivery, Orcha scans the PR's **branch name** and **title** for refs and links the PR to each **published** ticket they resolve to in your organization.

To get a PR onto a ticket, put its ref in either place:

- **Branch name:** `feature/BUGS-1-fix-login`
- **PR title:** `Fix login redirect (BUGS-1)`

Notes on matching:

- Product codes match **case-insensitively** — `bugs-1` and `BUGS-1` are the same ref.
- A PR can name **several tickets**; it appears on all of them.
- The link set is **re-derived on every update**. Edit the title to drop a ref and the PR drops off that ticket; the mirror always reflects the PR's *current* branch and title.
- A PR that names no ticket is simply ignored — unrelated PRs never pile up.
- The ticket must be **published**; refs to drafts or unknown products are dropped silently.

## The Changes tab

Open a ticket and select **Changes** to see its linked pull requests. Each row shows:

- a **state badge** — **Open** (green), **Draft** (gray), **Merged** (purple), or **Closed** (red)
- the PR **title** and **`#number`**
- the **author's** GitHub login
- when GitHub last **updated** it
- a link **out to the PR** on GitHub

The tab is purely a reflection of GitHub. Everything you act on — reviews, merges, comments — happens on GitHub; Orcha just keeps the ticket in sync.

## Self-hosting

Nothing changes except the host. The Payload URL Orcha generates already points at your own deployment's API origin (for the hosted version that's `api.orcha.run`; self-hosted, it's your configured API domain), so you paste whatever the dialog gives you. The same webhook secret and `application/json` content type apply.

## What it doesn't do

This is a deliberately small, one-way integration (see [ADR 0011](https://github.com/whileTrueYield/orcha)):

- **No write-back.** Orcha never creates branches, comments, statuses, or PRs.
- **No polling or backfill.** Only pull requests opened or updated *after* the webhook is live are mirrored — it's forward-only.
- **No commit-level detail.** Pushing new commits (`synchronize`) doesn't change a PR's state, title, or draft flag, so it isn't mirrored.
