---
title: How Scheduling Works
description: How Orcha uses Monte Carlo simulations to build team schedules with delivery dates you can actually trust.
---

:::tip[The principle]
Your computer is better at math than your meeting. 60 seconds of simulation beats hours of replanning.
:::

You've spent hours in replanning meetings and still ended up with bad predictions because you had the wrong tool. Spreadsheets, Gantt charts, gut feeling -- they all break the same way. Someone gets sick, a ticket takes three times longer than expected, and suddenly your "plan" is fiction.

Orcha takes a different approach. You give it your tickets, your team's availability, and your priorities. It runs 2,000 simulations in under 60 seconds, exploring thousands of possible assignment permutations, and returns a schedule with delivery dates you can trust. Event-triggered runs (like a priority change or a new ticket) push that to 5,000 simulations for higher fidelity.

## Three estimates, not one

:::note[The promise]
**Don't ask unless asking pays.**
User input is expensive. Before Orcha asks you anything, we've looked for every way not to. When a question does make it through, the answer is worth more than the cost of giving it.
:::

Every workflow step in Orcha takes three time estimates in hours: best case, most likely, and worst case. We know, estimates are the part of project management that everyone dreads. But we're not asking you to be precise. We're asking you to be honest about uncertainty.

Best case is the optimistic path where nothing goes wrong. Most likely is what happens on a normal day. Worst case is the version where you hit every snag you can reasonably foresee. Those three numbers give the scheduler a [PERT distribution](https://en.wikipedia.org/wiki/PERT_distribution), the shape of your uncertainty, not just a single number that makes everyone feel comfortable and no one actually believes.

The scheduler samples from this range across every workflow step, every person, every run.

> **Under the hood: PERT and the beta distribution.** Your three estimates are converted into a [beta distribution](https://en.wikipedia.org/wiki/Beta_distribution) using the PERT method with lambda=4.0. The shape parameters are derived as `alpha = 1 + 4*(likely - min)/(max - min)` and `beta = 1 + 4*(max - likely)/(max - min)`, which weights the distribution heavily toward your most likely estimate while preserving the tails. Orcha pre-computes 500-1000 samples per task so that simulation runs draw from a cached pool rather than generating random variates on the fly. The deterministic PERT average -- `(min + 4*likely + max) / 6` -- is what you see in the UI before a simulation runs.

## Individual estimates are unreliable. Team statistics converge.

Here's the thing no one wants to say out loud: individual predictions are always wrong. You will never accurately predict how long a specific ticket takes for a specific person on a specific week.

But that's fine. You don't need to.

When you aggregate estimates across a team and run thousands of simulations, the [law of large numbers](https://en.wikipedia.org/wiki/Law_of_large_numbers) kicks in and the statistical model converges. Past data plus probability distributions beat gut feeling every time. The more history Orcha has, the sharper the predictions get -- it adjusts for people who consistently finish faster or slower than they estimate. This is the same principle behind [Monte Carlo methods](https://en.wikipedia.org/wiki/Monte_Carlo_method): individual samples are noisy, but the aggregate tells the truth.

> **How the simulator explores assignments.** Orcha doesn't brute-force every permutation. It uses [Monte Carlo tree search (MCTS)](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search) to intelligently explore the space of possible task-to-person assignments. Each node in the tree represents an assignment decision, and its children are the available tasks that could be scheduled next. The algorithm balances exploration and exploitation using [UCB (Upper Confidence Bound)](https://en.wikipedia.org/wiki/Monte_Carlo_tree_search#Exploration_and_exploitation) scoring: `score_sum/visits + prior * sqrt(log(parent.visits)/visits)`, with a default prior of sqrt(2). Each iteration follows four steps -- selection, expansion, rollout, backpropagation -- converging on high-quality schedules without exhaustively evaluating every possibility.

## What you get back

The scheduler returns 80% [confidence interval](https://en.wikipedia.org/wiki/Confidence_interval) delivery dates -- specifically, the p80 (80th percentile) drawn from all simulation endpoints. That means: four out of five times, you'll hit this date or beat it. Not a best-case fantasy. Not a padded-to-hell worst case. A number grounded in how your team actually works.

> **Other percentiles are captured too.** Orcha records p50, p70, p80, p90, and p95 from the simulation results. The p80 is the default because it strikes the right balance between optimism and safety. If you need a tighter commitment for a client deadline, look at the p90 or p95. If you want the coin-flip date, p50 is there.

The schedule accounts for your team's real work weeks, time zones, vacations, and the priority order you've set. Every simulation respects these constraints, so the output reflects reality rather than a whiteboard abstraction.

## The right level of effort

Orcha asks you for three numbers per workflow step and handles the rest. No resource leveling spreadsheets. No all-hands estimation poker sessions that eat an afternoon and produce a number everyone silently disagrees with.

You define what needs to ship and how important it is. The math handles when and who.
