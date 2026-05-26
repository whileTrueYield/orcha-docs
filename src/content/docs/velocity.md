---
title: Velocity & Accuracy
description: Two measurements Orcha gathers automatically to model how each person actually estimates, so Autopilot can correct for it.
---

Estimates are guesses, and some people consistently beat them while others consistently miss. The usual fix is to nag the slow estimators or pad everything with a buffer. Neither works. The estimates stay wrong and the schedule stays fiction.

Orcha takes a different approach: it measures how each person estimates against reality and feeds that back into the scheduler. There is nothing to fill in -- the numbers are gathered as you use Orcha, because anything you'd type in by hand would be a guess about your own guessing, and that's exactly the loop we're trying to close.

## Two different things: bias and accuracy

Orcha tracks two distinct measurements per person, and they answer two different questions.

### Bias -- which direction you lean

Bias captures whether someone tends to **over-promise** or **under-promise**.

- **Optimist** -- estimates come in shorter than reality. "I'll have it done this afternoon" becomes next Tuesday.
- **Pessimist** -- estimates come in longer than reality. "This will take months" turns into two weeks of actual work.

Neither is wrong. Both are just patterns, and once Autopilot knows the pattern, it can correct for it in simulation.

### Accuracy -- how consistent that lean is

Accuracy captures whether someone's bias is **stable**. Are they reliably in the same direction on every task, or are they all over the place depending on the day?

A consistently biased estimator is easy to schedule around, their margin of error is small, so the simulation can correct their estimates with confidence. An inconsistent estimator forces the simulation to widen its uncertainty bounds, which makes every prediction softer.

> **Being accurate beats being unbiased.** A person who is reliably optimistic is more useful to the scheduler than a person who is, on average, perfectly calibrated but swings wildly task to task. The first one Autopilot can correct. The second one just adds noise.

## How Autopilot uses them

Both measurements feed into Autopilot's simulation. Bias tells it which way to nudge a person's estimates; accuracy tells it how much to trust that nudge. Together they produce a schedule that reflects how your team actually works, not the idealized version where everyone's estimates land on the dot.

## Nothing to configure

There are no inputs on this page. Bias and accuracy are derived from the gap between estimates and actual completion times as you work in Orcha. The more history a person has, the more confident the measurement becomes, and the more honest the schedule.

Self-reported velocity would just inherit the same biases it's trying to measure. Measurement against reality is the only thing that doesn't lie.
