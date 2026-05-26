---
title: Time-Offs
description: Mark vacations, sick days, and conferences so the scheduler routes around them automatically.
---

Someone is out for a week. In most tools, that means opening a Gantt chart, dragging tasks around, checking what depends on what, and hoping you didn't miss a downstream deadline. It's tedious and error-prone.

## How Orcha handles it

Time-offs feed directly into the scheduler as constraints. When you add a time-off for a team member, the scheduler treats those days as unavailable. Every task assigned to that person shifts forward, and every task that depends on their work shifts too. Autopilot re-simulates the full schedule and shows you the updated ETAs immediately.

> **Overlapping entries are merged automatically.** If you add a vacation from Monday to Wednesday and a conference from Wednesday to Friday, the scheduler merges them into a single Monday-to-Friday block using an [interval merging algorithm](https://en.wikipedia.org/wiki/Interval_(mathematics)#Interval_arithmetic). You don't need to reconcile overlaps manually -- the system handles it.

## What counts as time-off

Anything that blocks someone from working: vacation, sick days, conferences, company offsites, parental leave. You set a start date and end date, and the scheduler does the rest.

## Cascading impact

The real value is not just shifting one person's tasks -- it's seeing the [ripple effect](https://en.wikipedia.org/wiki/Cascading_failure). If your backend lead is out the week before a release, you'll know right away whether the release date holds or slips, and by how much. No guesswork, no stale Gantt charts.

## Adding time-off

Open the team member's profile, add the time-off period, and let Autopilot recalculate. The schedule updates within seconds.
