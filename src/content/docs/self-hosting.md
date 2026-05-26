---
title: Self-Hosting
description: Deploy Orcha on your own infrastructure with Docker Compose and automatic HTTPS.
---

If you want full control over your data and infrastructure, you can run Orcha on your own server. The setup is a single script, and updates are a one-liner.

## Prerequisites

- **Hardware:** 2 CPU cores, 4 GB RAM, 20 GB disk (more for large file uploads)
- **OS:** Linux with Docker and Docker Compose installed
- **Network:** A domain name with a DNS A record pointing to your server's public IP

## Quick start

Clone the repository, run the setup script, and start the stack:

```bash
git clone https://github.com/whileTrueYield/orcha.git
cd orcha
./orcha-setup.sh
make prod
```

The setup script walks you through configuration: domain name, email provider, admin credentials, and secrets. It generates your `.env` file and TLS certificates are handled automatically on first boot.

## Architecture

Orcha runs as a [Docker Compose](https://docs.docker.com/compose/) stack behind a [Traefik](https://traefik.io/traefik/) reverse proxy. Traefik handles automatic TLS via [Let's Encrypt](https://letsencrypt.org/) and routes traffic by path:

| Path | Service |
|------|---------|
| `/` | Frontend (React/Vite) |
| `/api` | Backend (Node.js/TypeScript) |
| `/ws` | [Hocuspocus](https://tiptap.dev/docs/hocuspocus/introduction) (real-time collaboration via [Yjs](https://docs.yjs.dev/) CRDTs) |
| `/scheduler` | Scheduler (Python) |
| `/uploads` | MinIO (file storage) |

The backend is Node.js/TypeScript with Hocuspocus handling real-time collaboration. The scheduler is a separate Python service that uses [NumPy](https://numpy.org/) to sample [PERT distributions](https://en.wikipedia.org/wiki/PERT_distribution) during Monte Carlo simulation -- it runs independently and communicates results back to the backend.

All services run on a single machine. Traefik is the only container that binds to ports 80 and 443.

## Email

Orcha needs an email provider for invitations and notifications. The setup script supports two options:

- **SMTP:** Any standard SMTP server (Postfix, Mailgun, SES, etc.)
- **Resend:** API-based delivery -- just provide your API key

Configure your choice during setup. You can switch later by editing the `.env` file and restarting.

## Backups

Three things to back up:

```bash
# Postgres -- your projects, tickets, and team data
pg_dump -U orcha orcha > backup.sql

# MinIO -- uploaded files and attachments
tar -czf minio-backup.tar.gz ./data/minio

# Redis is ephemeral -- used for caching and pub/sub only, no backup needed
```

Run these on a cron schedule that matches your tolerance for data loss. Daily is a reasonable starting point.

## Updating

Pull the latest changes and rebuild:

```bash
git pull && make prod
```

Docker Compose rebuilds only the containers that changed. Migrations run automatically on startup. Downtime is typically under a minute.
