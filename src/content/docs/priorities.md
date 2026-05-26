---
title: Priorities
description: How Orcha's relative priority system determines what gets scheduled first, no P1/P2/P3 labels, just a single ordered stack where tickets, tags, and projects can be mixed freely.
---

:::tip[The principle]
Priorities are relative, not absolute. A single ordered stack, no P1/P2/P3, no ties, no ambiguity.
:::

Priority in most tools is a label. You mark something "high" and hope for the best. Within a month, everything is "high" and the label means nothing. This is the classic P1/P2/P3 trap: when priority is a bucket instead of a ranking, every stakeholder fights to get their work into the top bucket, and the whole system collapses into noise.

Orcha does priorities differently. They aren't absolute levels, they're **relative**. There's no P1/P2/P3. Instead, you build a single ordered stack where everything has a position relative to everything else. If you want ticket A above ticket B, you put it above ticket B. There is exactly one list, and every item has exactly one position in it.

## Relative, not absolute

Every other tool gets this wrong. They give you three or five priority levels and expect you to bucket everything into them. But priority isn't a category, it's a ranking. Ticket ABC-123 is more important than the "Urgent" tag, which is more important than Project A, which is more important than all bugs. That's a statement you can't express with P1/P2/P3.

> **Under the hood.** Priority is a numeric value where lower means higher priority. Priority -1 beats priority 0, which beats priority 10. This gives you a strict [total order](https://en.wikipedia.org/wiki/Total_order), every pair of items has a definitive ranking, no ties, no ambiguity.

In Orcha, the priority stack lets you freely mix three types of items:

- **Individual tickets**, a specific bug or feature that needs to jump the queue
- **Tags**, a group of tickets sharing a label, like "launch-critical" or "urgent"
- **Projects**, an entire project's worth of tickets

You drag them into a single ordered list. A ticket can sit above a tag, which sits above a project. The scheduler reads this ordering top to bottom and schedules accordingly. No ties, no ambiguity, no "everything is P1."

## How the scheduler uses priorities

The priority stack isn't just a visual ranking, it drives the scheduling engine directly. The scheduler groups tasks into priority groups and processes them as a [priority queue](https://en.wikipedia.org/wiki/Priority_queue), always filling higher-priority groups first before moving on to lower ones.

But the interesting part is what happens when tasks depend on each other.

> **Priority inheritance.** When a low-priority task blocks a high-priority one, the scheduler automatically promotes it. In the internal task tree, every node inherits the minimum priority value of itself and all its successors. So if your P10 backend migration is blocking a P0 launch-critical feature, the migration gets promoted to P0 during scheduling, without you having to touch the priority stack. This is the same concept as [priority inheritance](https://en.wikipedia.org/wiki/Priority_inheritance) in real-time operating systems, where it was invented to solve [priority inversion](https://en.wikipedia.org/wiki/Priority_inversion), the bug that nearly killed the Mars Pathfinder mission in 1997.

This means you only need to set priority on the work that matters to you. The scheduler figures out what else needs to move to make that happen.

## Simulate before you commit

The Edit Schedule view lets you reorder priorities and run the simulation before saving. Drag a project up the priority list and see what happens to delivery dates across the board. If the tradeoff isn't worth it, undo and try something else.

No more vague assumptions about what ships first. No more "I think we can fit it in." The math tells you what fits, what slips, and by how much.

## Why this matters

Priority decisions happen constantly, in standups, in Slack threads, in one-on-ones with stakeholders. Without a system that translates priority into schedule impact, those decisions are made on instinct and forgotten by the next meeting. Orcha makes the tradeoff visible and concrete, every time.
