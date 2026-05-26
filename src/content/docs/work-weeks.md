---
title: Work Weeks & Time Zones
description: How Orcha handles per-person work schedules, time zone handoffs, and time-off when building your team's schedule.
---

:::tip[The principle]
Time zones are a scheduling constraint, not a footnote. A 12-hour gap between dev and QA is a full day added to every handoff.
:::

Not everyone works Monday through Friday, nine to five. Orcha doesn't pretend they do.

## Per-person work weeks

Work weeks in Orcha are defined per person. One developer might work Monday through Thursday. A contractor might work Tuesday through Saturday. A part-timer might only be available three days a week. The scheduler places tasks into each person's actual available hours, not some company-wide default.

Each day can contain multiple time blocks -- for example, `09:00-12:00` and `13:00-17:00` to model a lunch break. The scheduler consumes these blocks directly, so the granularity of your schedule is the granularity of the simulation.

This means the schedule reflects how your team really operates, not how an HR template says they should.

## Time zones as a scheduling constraint

Most project management tools pretend everyone is in one [timezone](https://en.wikipedia.org/wiki/Time_zone). Orcha doesn't.

If your QA team starts their day 12 hours after your dev team finishes, that's a full calendar day added to every handoff between them. The scheduler accounts for this. It knows that handing a task from someone in UTC-5 to someone in UTC+7 isn't instant -- it models the actual wait time before the next person can pick it up.

This matters more than people think. A team spread across three time zones doesn't just have a communication problem -- it has a scheduling constraint that compounds across every dependent task. Ignoring it produces ETAs that look right on paper and miss in practice.

## Time-off

Vacations, sick days, company holidays -- they're all modeled as blocked time on a person's schedule. The scheduler routes around them.

If your lead developer is out for a week, the tasks that would have been assigned to them shift to other team members or wait. Either way, the delivery dates update to reflect reality. No one has to mentally subtract vacation days from a Gantt chart and hope the math works out.

When someone marks time-off, Autopilot re-runs the simulation immediately, so you see the schedule impact before it becomes a surprise.

> **Under the hood** -- When time-off entries overlap (say, a company holiday during someone's vacation), Orcha merges them using an [interval merging](https://en.wikipedia.org/wiki/Interval_(mathematics)) algorithm so the same hours are never double-counted. The merged result feeds into the availability generator alongside work week blocks and timezone offsets.

## How availability reaches the scheduler

All of these settings -- work week blocks, timezone offsets, and merged time-offs -- converge in a single availability generator. It yields the concrete time blocks each person is available for work, and the scheduler consumes those blocks directly. Nothing is approximated; if a person's Wednesday afternoon is blocked, the scheduler sees the gap and plans around it.
