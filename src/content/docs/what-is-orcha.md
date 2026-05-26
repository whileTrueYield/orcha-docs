---
title: What is Orcha
description: Orcha is an opinionated project manager that uses Monte Carlo Tree Search to build optimal team schedules, giving you instant answers when priorities shift.
---

You've been asked to bump a feature up. What slips? By how much? Who's affected?

If your answer involves opening a spreadsheet, pinging three people on Slack, or sitting through a replanning meeting, you already know the problem. Priorities change constantly. The tools most teams rely on have no opinion about what happens next. They show you a board of statuses and leave the math to you.

Orcha does the math.

## The core idea

Orcha is a project manager built around a Monte Carlo Tree Search scheduler. It runs 2,000 simulations of your team's workload and produces ETAs at 80% confidence. When something changes, a priority shifts, someone takes time off, a task balloons, it re-runs automatically and shows you the consequences in about 60 seconds.

This isn't a Gantt chart you drag around by hand. It's a scheduler. You tell it what matters, and it tells you when things land.

## Philosophy

Orcha was built from real pain managing engineering teams in a startup where priorities changed weekly and existing tools always fell behind. A few principles came out of that experience:

**Priorities are relative, not absolute.** P1/P2/P3 labels are broken, everything becomes P1. Orcha uses a single ordered stack where you rank individual tickets, tags, and entire projects against each other. No ties, no ambiguity. And when you change the order, Orcha absorbs the change and instantly shows the downstream effects.

**A person is unpredictable, a team is not.** Individual estimates are noisy. But statistical models over a team converge. Orcha asks for three estimates per workflow step, best case, likely case, worst case, and fits them to a [beta distribution](https://en.wikipedia.org/wiki/Beta_distribution) that captures the shape of uncertainty for each phase of work. On every simulation run, the MCTS scheduler samples fresh values from those distributions for every ticket and every person. The result: schedules grounded in probability, not gut feeling.

> **Why beta distributions?** A single-point estimate is a guess dressed up as a commitment. Three points define a curve, one that can be skewed toward optimism or pessimism depending on how far apart your best and worst cases are. The simulator doesn't average your estimates; it samples from the full range, weighted by where you said "most likely" falls. That's what makes the 80% confidence dates hold up in practice.

**Your computer is better at math than your meeting.** A minute of simulation replaces hours of manual replanning. With Autopilot enabled, the scheduler runs on every change, so your schedule is always current.

**Don't track time, just switch tasks.** Orcha tracks time automatically based on which task you activate. No timesheets. No end-of-day guilt. Just switch to what you're working on.

**Simple systems are predictable systems.** Orcha uses linear workflows by design. No conditional branching, no state machines with fifteen transitions. A ticket moves forward through a sequence of stages, and that's it.

## What makes it different

Most project management tools, Jira, Linear, Asana, are status boards. They're good at tracking where things are. They can't tell you where things will be.

Orcha is a scheduler. It takes your tickets, estimates, priorities, team capacity, time-offs, and dependencies, and computes an optimal schedule. When reality changes, it recomputes. You get calendar views, swimlanes, Gantt charts, and scheduled ticket lists, all derived from the same simulation, all consistent with each other.

Beyond scheduling, Orcha includes:

- **Collaborative editing** powered by CRDTs
- **An integrated Excalidraw canvas** for sketching ideas in tickets and notes
- **Dependency visualization** to see what blocks what
- **Per-engineer swimlanes** with drag-to-reassign
- **A task switcher** that always shows you what to work on next

## Open source and self-hostable

Orcha is open source under [FSL-1.1-MIT](https://github.com/whileTrueYield/orcha/blob/main/LICENSE). Run it on your own infrastructure or use the hosted version at [app.orcha.run](https://app.orcha.run). The codebase is on [GitHub](https://github.com/whileTrueYield/orcha).
