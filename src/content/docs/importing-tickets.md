---
title: Importing Tickets
description: How to import tickets into Orcha from CSV, useful for migrating from another project management tool.
---

If you're moving to Orcha from another tool, you don't have to recreate every ticket by hand. Orcha supports CSV import to bring your existing work in quickly.

## How to import

Navigate to the project where you want the tickets to land, open the project menu, and select **Import from CSV**. Upload your file and map the columns to Orcha's ticket fields.

## Expected format

Your CSV should include one row per ticket. The columns Orcha recognizes:

- **Title** (required), The ticket name.
- **Description**, The ticket body. Plain text or basic HTML.
- **Best estimate**, Best-case duration.
- **Likely estimate**, Likely-case duration.
- **Worst estimate**, Worst-case duration.
- **Priority**, A numeric priority value.
- **Assignee**, The email address of the team member to assign. Must match an existing account in your organization.

Columns that don't match a known field are ignored, so you can import a raw export from another tool without cleaning it up first.

## After import

Imported tickets land as unscheduled. Review them, fill in estimates and assignees for each workflow step, and they'll be ready for the scheduler. Once that's done, Autopilot picks them up and folds them into the schedule automatically.

This is a one-time migration step. For ongoing work, create tickets directly in Orcha to take advantage of the full editor, dependencies, and collaborative features.
