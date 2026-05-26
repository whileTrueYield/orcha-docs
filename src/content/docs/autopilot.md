---
title: Autopilot
description: Autopilot re-runs the scheduler on every change, so your ETAs are always current -- not stale snapshots from last night's batch job.
---

:::tip[The principle]
Stale ETAs are worse than no ETAs. Every change triggers a fresh simulation automatically.
:::

Most tools re-estimate on a schedule -- nightly at best, manually at worst. By the time you see updated dates, three things have already changed and the numbers are stale again.

Autopilot works differently. It follows an [event-driven architecture](https://en.wikipedia.org/wiki/Event-driven_architecture) -- any change that could affect your schedule triggers a fresh simulation automatically. Your ETAs are always current, not a snapshot from last night.

### What triggers a re-simulation

Autopilot watches for every event that could shift a date:

- **Schedule config updates** -- work weeks, capacity changes.
- **Schedule items created or updated** -- new milestones, changed dates.
- **Time off created or deleted** -- someone books a vacation, the schedule adapts.
- **Role updates or deletion** -- team structure changes ripple through assignments.
- **Blackout time changes** -- both recurring (e.g., no-deploy Fridays) and one-off blocks.
- **Ticket updates** -- priority, dependencies, status, or estimate changes.
- **Batch ticket edits** -- reprioritize 20 tickets at once, still one simulation.

> **Debouncing, not spamming.** Every trigger doesn't mean every simulation. Autopilot uses a [debounce](https://en.wikipedia.org/wiki/Switch#Contact_bounce) strategy: after a change, it waits before running. Full estimates wait **65 seconds**; quick estimates wait **5 seconds**. If you reprioritize 10 tickets in a row, those changes batch into a single simulation run. This keeps the system responsive without wasting compute on intermediate states that nobody will ever see.

Event-triggered runs use **5,000 simulations** for higher confidence. Standard on-demand runs use 2,000 simulations with a 60-second time limit.

## The real cost of a change

The most useful thing Autopilot gives you isn't the new dates -- it's the delta between old and new.

You've been asked to bump a feature up the priority list. Before Autopilot, that's a meeting, a debate, and a vague sense that "some stuff will slip." With Autopilot, you make the change and see exactly what slips and by how much -- within about a minute. The conversation shifts from opinion to data.

Same thing when someone goes on vacation, a new hire joins the team, or a ticket balloons from "quick fix" to "deep refactor." Every change ripples through the schedule, and Autopilot shows you the full impact immediately.

## Why this matters

Stale ETAs are worse than no ETAs. They create false confidence. People make commitments based on numbers that stopped being true two days ago, and no one finds out until it's too late.

Autopilot keeps the schedule honest. Not because someone remembered to click "recalculate" -- because the system does it automatically, every time something moves. You never have to wonder whether the dates you're looking at are current. They are.

> **Quick vs. full estimates.** Quick estimates (5-second debounce, 2,000 simulations) are for lightweight feedback while you're actively editing -- fast enough that you don't lose your train of thought. Event-triggered full estimates (65-second debounce, 5,000 simulations) run in the background with higher [statistical confidence](https://en.wikipedia.org/wiki/Confidence_interval), giving you numbers you can commit to externally.
