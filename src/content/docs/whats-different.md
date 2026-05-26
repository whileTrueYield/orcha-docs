---
title: What's Different
description: How working with Orcha differs from other project management tools, linear workflows, locked estimates, relative priorities, and a scheduler that fills the gaps.
---

:::tip[The principle]
**There's math behind every choice.**
Every design decision exists to make the scheduler smarter and your life simpler. If something feels unusual, it's deliberate, and the reasoning holds up.
:::

If you're coming from Jira, Linear, Asana, or any other project management tool, a few things will feel different in Orcha. None of them are accidental. Each one exists because it makes the scheduling model more accurate or removes a burden from your team.

## Tickets have a lifecycle before the workflow starts

In most tools, a ticket is created and immediately enters a workflow. In Orcha, tickets go through a lifecycle first:

1. **Draft**, the ticket exists but isn't ready. Use it for rough ideas or work that needs more detail.
2. **Unscheduled**, you've published the draft. Now you assign it to someone and send it for estimation.
3. **Scheduled**, the ticket has estimates and has been included in a simulation. It gets a delivery date. The project workflow (Development, Code Review, QA, etc.) kicks in here.
4. **Done / Cancelled**, completed or dropped.

The workflow you define per project, whatever stages make sense for your team, only activates after scheduling. Before that, the ticket is moving through the lifecycle above. This separation means the scheduler always has what it needs (estimates, assignments) before it tries to place a ticket.

## Every workflow step needs an assignee and an estimate

Each step in your workflow, not just the ticket overall, requires someone responsible and a three-point estimate (best case, most likely, worst case). Development might take one week, code review two days, QA another week. These are different kinds of work with different uncertainty profiles, and the scheduler models them separately.

This gives you something most tools can't: accurate per-phase delivery dates and the data to spot systemic bottlenecks, like a code review step that routinely blows past its worst case.

## Workflows are linear

No branching, no conditional paths, no state machines with fifteen transitions. A ticket moves forward through a sequence of stages. That's it.

Not because real work is simple, because complex workflows create hidden states where work gets lost and predictions break down. A simple system is a predictable system. Every transition requires a note explaining why the ticket moved, so you always know what happened and when.

## Estimates are locked after scheduling

Once a ticket is scheduled, its estimates can't be changed. This feels unusual, but it prevents a subtle problem: if people revise estimates after seeing how long something actually took, you introduce bias. The statistical model needs consistent inputs to converge.

Think of it like a scientific experiment, you don't adjust your hypothesis after seeing the results. Estimates made with consistent context, before the work begins, are what allow the model to learn how your team actually works.

:::note
It takes roughly 20 tickets before the math kicks in and predictions start to sharpen. The first few schedules are based on your estimates alone. After that, the model calibrates from real data.
:::

## The dashboard eliminates the estimation chase

Every PM has sent some version of "can you please estimate your tickets?" on Slack. In Orcha, the dashboard puts unestimated tickets front and center for each person. No nagging required, the system makes it obvious what needs your input, and why it matters (the scheduler can't produce dates without estimates).

## Projects are folders

No project ontology to learn. A project is a folder. You want sub-projects? Put a folder inside a folder. You want to reorganize? Drag it somewhere else, like a filesystem, because you already know how to organize information. Each project gets a readme, an analytics view, and a dependency graph automatically.

## Priorities are relative, not absolute

There's no P1/P2/P3 in Orcha. Instead, you build a single ordered stack where every item has a position relative to everything else.

You can be as simple as you want, create tags called P1, P2, P3, P4 and stack them. The scheduler will respect that ordering. But you can also mix and match: put an urgent ticket above the "Bugs" tag, which sits above Project A, which sits above everything else. A ticket, a tag, and a project, all in one ranked list.

The key insight is that priority is always relative in reality. Asking "how urgent is this?" is too abstract to be objective. But asking "should we work on Project A or Project B first?", that's a question anyone can answer. Orcha turns priority into a series of those concrete, pairwise decisions.

## The scheduler fills the gaps

The scheduler doesn't just work on the highest-priority items and ignore everything else. It fills the gaps. When a high-priority ticket is blocked, waiting on a dependency, or waiting for someone in another time zone to start their day, the scheduler assigns lower-priority work into that idle time.

This means lower-priority tickets still make progress, but always respecting resource availability and the priority order you've set. You get maximum throughput without manually micromanaging who works on what and when.

## Automated time tracking with no reporting burden

There are no timesheets in Orcha. No start/stop buttons. No end-of-day forms. You activate a task in the Task Switcher when you start working on it, and switch to another when you move on. That's all.

The system tracks time passively from your task switches. The assumption is simple: if you ask people to track time, they won't, or they'll produce fiction. It's not about adding to the burden of work. It's about making work enjoyable again while still giving the model the data it needs to improve.
