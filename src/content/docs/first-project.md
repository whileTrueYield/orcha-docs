---
title: Your First Project
description: Step-by-step guide to creating your first project in Orcha, from folder setup to automatic scheduling with Autopilot.
---

This guide walks you through creating a project, adding tickets, and letting the scheduler do its job. By the end, you'll have a working schedule generated automatically.

## Create a project

Projects in Orcha are folders. They hold tickets, and they can nest inside each other for larger efforts.

To create one, open the sidebar, right-click in the project tree, and select **New Project**. Give it a name that your team will recognize, this shows up in schedules, analytics, and search.

### Add a readme

Every project can have a readme. Use it to describe the project's goals, scope, or anything a teammate would need to know before picking up work. The readme uses the same rich text editor as tickets, so you can embed images, links, and formatted text.

## Create tickets

Inside your project, create tickets for the work that needs to happen. Each ticket starts as a **draft**. When it's ready, publish it, it becomes **unscheduled** and surfaces on your team's dashboards for estimation.

Each ticket has:

- **A title and description**, Use the rich text editor to describe the work. Be specific enough that someone else could pick it up.
- **A priority**, Where this ticket sits relative to everything else.

## Set up a workflow

Each project has a workflow, a linear sequence of stages that tickets move through. Something like _Development_, _Code Review_, _QA_, _Done_. Keep it simple. Orcha enforces linear progression by design, so there are no conditional branches or backward transitions to manage.

Each workflow step requires its own **assignee** and **three-point estimate** (best case, likely case, worst case). Development might take one week, code review two days, QA another week, different work with different people and different uncertainty profiles.

Every transition between stages requires a note explaining why the ticket moved. This is non-negotiable by design, it's how teams preserve context instead of losing it.

## Estimate and schedule

Once your published tickets have estimates and assignments for each workflow step, Autopilot kicks in. The scheduler runs 2,000 simulations, accounts for priorities, dependencies, team capacity, and time-offs, and produces a schedule with 80% confidence ETAs.

Open the **Schedule** page from the sidebar to see the results. Every time you change a priority, add a ticket, or adjust an assignment, the schedule recalculates automatically.

No replanning meetings required.

:::note
Once a ticket is scheduled, its estimates are locked and can't be changed. This prevents bias and lets the statistical model converge, it takes roughly 20 tickets for the math to kick in and predictions to sharpen.
:::
