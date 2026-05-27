---
title: "Monte Carlo Tree Search for Project Scheduling"
description: "Reality is too complex for human planning. MCTS explores thousands of futures so you don't have to rely on your gut."
date: 2026-06-30
draft: true
---

# Monte Carlo Tree Search for Project Scheduling

Reality is nearly impossible to comprehend or plan for. You can only do your best with the information you've got. And the reality is far beyond your gut feeling.

Dealing with 8 engineers? Maybe you can hold it in your head. 12? It's getting hard. 100 engineers across 20 projects, with changing plans, hiring, people leaving, issues taking 2x or 4x longer than expected? Nothing you can truly predict.

But statistics takes that chaos and normalizes it — if you give it a chance.

## The Problem With Human Planning

When you plan a project, you see the happy path. Maybe you see a couple of risks. If you're experienced, you might see a few more. But you're still only exploring a handful of possible futures out of thousands.

How do you account for the engineer who goes on paternity leave in week 6? The critical dependency that takes three times longer than expected? The priority shift that moves half the team to a different project mid-sprint? The new hire who ramps up slower — or faster — than planned?

You can't. Not all at once. Not in a meeting room with a whiteboard and good intentions.

## Why MCTS?

Monte Carlo Tree Search was famously used to beat the world champion at Go — a game with more possible positions than atoms in the universe. Traditional search algorithms couldn't handle the combinatorial explosion. MCTS could, because it doesn't try to evaluate every possibility. It *simulates*.

It plays the entire game, thousands of times, using randomness to explore different paths. Each simulation adds statistical relevance. Over time, the most promising branches accumulate evidence, and the best moves emerge from the noise.

Project scheduling has the same fundamental challenge. Too many variables, too many combinations, too many possible futures for any deterministic algorithm — or any human — to evaluate exhaustively.

## How We Use It

Our approach is simple in principle: treat your project schedule as a game tree. Each decision — which task to assign, to whom, when — branches into a different future. MCTS explores thousands of these futures.

Each simulation:

1. Takes your prioritized backlog — the stack-ranked order you've defined
2. Assigns tasks to available people based on their roles, work weeks, and time off
3. Uses **random values drawn from beta distributions** for task durations — not point estimates, but realistic ranges shaped by uncertainty (if you missed it, [we wrote about this](/blog/beta-distributions-for-engineering-estimates))
4. Plays out the entire schedule to completion
5. Scores the result

No opinions. No gut feelings. Just exploration — but with your priorities in mind. We depile what you believe is high priority first, filling the gaps as we go, each simulation using different random draws from the distributions.

After thousands of simulations, the statistical picture emerges. Not a single predicted future, but a probability landscape — when is each task likely to land, given everything we know about the team, the work, and the uncertainty?

## What This Gives You

You stop asking "when will this be done?" and start asking "what's the probability this is done by this date?" That's a fundamentally different — and more honest — conversation.

And because each simulation takes milliseconds, we can run thousands of them in under a minute. The chaos that's impossible for a human to reason about becomes tractable for a computer that's willing to play the game five thousand times.

The randomness is what brings Monte Carlo to life. The structure and choices are the beauty of the tree search. Together, they explore more avenues than you could in a lifetime of planning meetings — and they do it without bias, without optimism, without politics.

Just math, applied to reality.
