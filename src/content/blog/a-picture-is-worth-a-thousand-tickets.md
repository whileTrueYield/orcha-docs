---
title: "A Picture Is Worth a Thousand Tickets"
description: "Text is lossy. Embedding drawing in tickets upgrades communication fidelity between client, product, engineering, and QA."
date: 2026-07-14
draft: true
---

# A Picture Is Worth a Thousand Tickets

There's a famous drawing that's been circulating in software teams for years. A client describes a swing. The project manager interprets it one way. The designer another. The developer builds something else entirely. QA tests against yet another understanding. And what the client actually needed was a tire on a rope.

It's funny because it's true. And it's true because we keep trying to communicate complex ideas with text alone.

## Text Is Lossy

A ticket that says "move the button to the right" means something different to the designer, the frontend developer, and the QA engineer. How far to the right? Relative to what? On which breakpoint? In which state?

We assume too much from short sentences. We read them, fill in the gaps with our own context, and move forward — each person carrying a slightly different picture of what was meant. The misalignment is invisible until it surfaces as a bug, a rework cycle, or a frustrated client.

## The First Form of Communication Was Drawing

Before language, before writing, humans drew. On cave walls, in sand, on whatever surface was available. Drawing was the first form of communication because it's the most direct — it shows what you mean, not what you manage to encode in words.

And still today, a picture is worth a thousand words. That's not a cliché — it's a statement about information density. A screenshot with a circle and an arrow communicates more precisely than three paragraphs of description. There's no ambiguity about "which button" when you're pointing at it.

## Why We Embedded Excalidraw in Our Ticket Editor

We realized there's more than one way to express an idea, and they're complementary. Text is good for logic, sequences, acceptance criteria. Drawing is good for layout, relationships, spatial concepts, "I mean *this* thing right *here*."

So we embedded Excalidraw directly in the ticket editor. Not as an attachment. Not as a link to an external tool. Right there, inline, where you're already writing.

You can sketch a wireframe. Paste a screenshot and annotate it. Draw a flow with arrows. Circle the part that's broken. Add a note explaining what should change. All of it lives in the ticket, alongside the text, as a first-class form of communication.

## Miscommunication Is the Real Bug

The gap between client, product, engineering, and QA isn't a process problem — it's a communication fidelity problem. Each handoff is an opportunity for information loss. Text-only tickets maximize that loss.

When a product manager can sketch what they mean, when a developer can annotate a screenshot to show what they built, when QA can circle what looks wrong — the fidelity goes up. The assumptions go down. The rework cycles shrink.

We should probably add audio too — because sometimes the best way to explain something is to just say it. Text, drawing, voice: three fidelity levels, each filling gaps the others leave.

The point isn't the technology. The point is that communication is hard enough without artificially limiting ourselves to one channel. Every tool that makes it easier to show what you mean — instead of hoping the other person guesses correctly — is worth having.
