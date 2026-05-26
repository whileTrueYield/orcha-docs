---
title: Time Tracking
description: Orcha tracks time automatically, no timesheets, no forms, no discipline required. Just switch tasks and the system handles the rest.
---

:::tip[The principle]
If you ask people to track time, they won't. Orcha tracks it automatically, nothing to install, nothing to report.
:::

If you ask people to track time, they won't. Or they'll lie. Or they'll forget and reconstruct Friday afternoon from memory. Every manual time tracking system eventually degrades into fiction, and then you're making decisions based on bad data.

> **Why timesheets poison the data.** This is a textbook case of the [observer effect](<https://en.wikipedia.org/wiki/Observer_effect_(physics)>): the act of measuring changes the thing being measured. When you force people to report time, you don't get an accurate record of how they work, you get a record of how they _think_ they work, filtered through guilt, rounding, and Friday-afternoon amnesia. The closely related [Hawthorne effect](https://en.wikipedia.org/wiki/Hawthorne_effect) makes it worse: people shift their behavior simply because they know they're being observed. The only way to get honest data is to remove the reporting burden entirely.

Orcha doesn't ask you to track time. It does it for you.

## How it works

Activate a task in the Task Switcher. Work on it. When you move to something else, click the next task. That's the entire interface. No start/stop buttons, no time entry forms, no end-of-day reports to fill out.

Under the hood, when a task transitions to "in progress", the system records a `startedAt` timestamp. When you switch away, it records `stoppedAt`. These events accumulate silently, no manual input, no confirmation dialogs. The time data is a byproduct of task switching, not a separate activity.

There's nothing to install, nothing to configure, and nothing to remember.

## Feeding the model

Time data feeds back directly into the scheduler. The scheduler replays past events, every start, stop, and transition, to reconstruct the actual workflow state of each ticket. This historical replay builds an accurate picture of real time spent, not estimated time spent, and the model uses that ground truth to recalibrate.

If you consistently work more or fewer hours than the baseline, the model adjusts. If a team member always finishes faster than their estimates, the scheduler accounts for it. If someone's estimates are consistently optimistic, the model learns the real ratio.

The scheduler also recognizes your currently active task, the one where `stoppedAt` is still null. It picks up the simulation from where you actually are in that task, not from zero. This means the schedule reflects reality in real time, not just at the end of the day.

> **Feedback loop, not surveillance.** The goal is better predictions, not better monitoring. Traditional timesheet tools produce reports for managers. Orcha feeds time data back into the scheduler so the _schedule itself_ gets smarter. The difference matters: one creates a reporting burden, the other eliminates it.

This isn't surveillance. It's calibration.

## The real point

Time tracking shouldn't add to the burden of work. The entire premise of Orcha is that your tools should absorb complexity, not create it. Switch tasks when you switch tasks. The math handles itself. That's how you make work enjoyable again.
