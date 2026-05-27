---
title: "Why Comments Should Say Why"
description: "Only the 'why' lets you know if code should still exist. Without it, legacy accumulates from fear, not necessity."
date: 2026-07-28
draft: true
---

# Why Comments Should Say Why

When you write a comment, you tend to justify or explain how you built something, so someone can come after you and understand what you've done. It's well-intentioned. And it's the wrong instinct.

## The Archaeology Problem

When a developer encounters unfamiliar code, they're doing archaeology. They discover the scene, draw conclusions, and reconstruct the story in reverse. Comments that explain the *what* or the *how* help with that reconstruction — they're labels on the artifacts.

But here's the thing: if you need a comment to explain what the code does, the code is too complex. The code itself should be clear enough to tell the what and the how. Good naming, small functions, straightforward structure — these are the tools for communicating *what* and *how*. Not comments.

## The "My Code Is So Clean It Doesn't Need Comments" Trap

You'll hear people say it: "My code is simple enough to read, it doesn't even need comments." And they're right about the what and the how — clean code communicates those well.

But your code exists for a reason. And when that reason disappears, nothing in the code tells you. The what and the how are still there, perfectly readable, perfectly clean. The code works. It passes tests. It looks intentional.

So it stays. Because it exists, so it must be necessary, right?

## Only "Why" Can Be Revisited

When you know *why* something exists — the problem it solves, the constraint it works around, the edge case it guards against — you can ask a question that no amount of clean code can answer: *is this still true?*

- **The what** tells you the shape of the code. Useful, but the code already does that.
- **The how** tells you the approach. Again, the code shows this.
- **The why** tells you the *reason* — and the reason is the only thing that can change independently of the code.

A bug was fixed. A constraint was removed. An API changed. A workaround became unnecessary. If the *why* is written down, a future developer can read it, check whether the reason still holds, and make an informed decision to keep, refactor, or delete the code.

Without the *why*, they can't. So they leave it. Just in case.

## How Legacy Accumulates

Legacy code doesn't come from bad code. It comes from code that outlives its reason.

During development, we solve problems. And in solving those problems, we inevitably solve *inherited* problems too — side effects, workarounds, edge cases from adjacent systems. If we don't express these problems in comments — the *why* — then we're doomed to accumulate code that serves long-gone purposes.

Nobody deletes code they don't understand the reason for. It's too risky. What if it's important? What if removing it breaks something? The safe choice is always to leave it.

And so the codebase grows. Not because new problems require new code, but because old code can't be evaluated without its context. The *what* and *how* are visible. The *why* is lost. And without the *why*, you can't tell living code from dead code.

## The Optimization Argument

Here's the angle that often gets missed: explaining *why* invites optimization.

When you know the problem a piece of code solves, you can solve it better. You can look at the constraint and ask: is there a simpler way? Has the landscape changed? Can this be eliminated entirely?

You can't optimize what you don't understand. And you can't understand purpose from implementation alone. Only the *why* gives you permission — and direction — to improve.

## Write the Problem, Not the Solution

Complex logic should be preceded by a comment explaining the problem it solves and any constraints that led to the current approach. This makes the code *problem-focused* instead of *solution-focused*, and gives the next developer a chance to refactor it more efficiently.

Not "this function sorts the array in reverse order" — the code says that.

But "we sort in reverse because the downstream API processes items LIFO, and sending them in natural order causes a race condition under high load" — now you know. And the day that API changes, someone will read that comment and know this code can change too.

Write for the person who will delete your code. Give them the *why*, so they can do it with confidence.
