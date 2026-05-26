---
title: Collaborative Editing
description: Real-time collaborative editing for ticket descriptions and project readmes, because communication between product and engineering is always incomplete.
---

:::tip[The principle]
Communication is incomplete by nature. Give people better mediums to close the gap between "what I meant" and "what you understood."
:::

The gap between what someone meant and what someone understood is where most engineering waste lives. A ticket description written by one person and read by another is an exercise in interpretation. Static text in a text field makes that gap worse. Better mediums make it smaller.

## Real-time collaboration

Orcha's editor is built on TipTap with real-time collaboration powered by [Yjs](https://github.com/yjs/yjs), a high-performance [CRDT](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type) implementation. Multiple people can edit the same ticket description, project readme, or documentation page simultaneously. Changes merge automatically, no conflicts, no "someone else is editing this" locks, no copy-pasting between versions.

> **This is not Google Docs bolted onto a PM tool.** Most collaborative editors rely on [operational transformation](https://en.wikipedia.org/wiki/Operational_transformation), a technique that needs a central server to decide the "correct" order of edits. CRDTs take a fundamentally different approach: every client holds a full copy of the document, edits merge mathematically without a central authority, and the result converges to the same state everywhere. This property is called [eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency). It means collaboration keeps working even when your connection is flaky, edits sync when you're back online.

This means a product manager and an engineer can refine a ticket together in real time. Questions get answered inline. Ambiguity gets resolved where it lives, not in a separate Slack thread that no one will find next week.

## Under the hood

Real-time sync runs over WebSockets through [Hocuspocus](https://tiptap.dev/hocuspocus), a collaboration server purpose-built for Yjs documents. In multi-instance deployments, a Redis extension keeps all server nodes in sync so it does not matter which instance a client connects to.

> **Persistence is batched, not per-keystroke.** Changes are debounced with a 5-second delay and a 30-second maximum window before flushing to the database. This means rapid edits get batched into a single write instead of hammering storage on every character. The document in memory (and across connected clients) is always up to date, the debounce only affects when the database catches up.

Rate limiting sits in front of the WebSocket endpoint: a 200ms throttle per IP with a 5-second ban if the threshold is breached. Enough to stop abuse, invisible during normal editing.

## Excalidraw integration

Sometimes words aren't enough. Orcha includes an embedded Excalidraw canvas for sketching diagrams, wireframes, flows, and anything else that's easier to draw than describe. Sketches live inside ticket descriptions and project readmes, they're part of the document, not an external link that goes stale.

A rough sketch shared early closes more gaps than a polished spec shared late. The goal isn't pixel-perfect diagrams. It's closing the distance between "what I meant" and "what you understood."
