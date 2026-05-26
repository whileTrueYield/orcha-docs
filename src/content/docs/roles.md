---
title: Roles & Permissions
description: Three roles control who can do what in Orcha, Owner, Admin, and Member. Simple, no per-feature toggles.
---

Permission systems in most tools are a maze of checkboxes. You end up with twelve custom roles and nobody remembers what "Editor Plus" can actually do. Orcha keeps it to three roles with clear boundaries.

## Owner

Full control over the organization. Owners manage billing, organization settings, and everything Admins and Members can do. There is one Owner per organization. If you created the org, that's you.

## Admin

Admins run day-to-day operations. They can create and manage projects, manage tickets across the board, add and remove team members, configure work weeks, and trigger the scheduler. They cannot access billing or organization-level settings.

## Member

Members are the people doing the work. They can create tickets, edit tickets assigned to them, and use the task switcher. Time tracking happens automatically through task switching, no manual logging. They cannot manage other team members or change project-level settings.

## Why only three

More roles create more ambiguity. Three roles mean you never have to look up what someone can do -- the name tells you. If you need finer control, the answer is usually to move someone from Member to Admin, not to invent a new tier.
