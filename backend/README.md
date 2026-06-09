# arbor-cli

CLI for [Arbor](https://arbor-backend-qr7t.onrender.com/) — initialize repos, stage files, commit, push, pull, and log in against the hosted backend.

## Install

```bash
npm install -g arbor-cli
```

## Quick start

```bash
# 1. Initialize a local Arbor repo in the current directory
arbor init

# 2. Log in (uses the hosted API by default)
arbor login

# 3. Link to a repository URL from the Arbor frontend
arbor link https://your-frontend-url/repo/<repoId>

# 4. Stage, commit, and push
arbor add <file>
arbor commit "Your message"
arbor push
```

## Commands

| Command | Description |
|---------|-------------|
| `arbor init` | Create a `.Arbor` folder in the current directory |
| `arbor login` | Log in with email and password |
| `arbor link <url>` | Link the local repo to a remote repository |
| `arbor add <file>` | Stage a file for commit |
| `arbor commit <message>` | Commit staged changes |
| `arbor push` | Push commits to the remote backend |
| `arbor pull` | Pull changes from the remote backend |
| `arbor revert <commitId>` | Revert to a previous commit |
| `arbor start` | Run the API server locally (self-hosting) |

## Configuration

By default, CLI commands talk to:

**https://arbor-backend-qr7t.onrender.com**

Override with an environment variable or a `.env` file in your project root:

```bash
ARBOR_API_URL=https://arbor-backend-qr7t.onrender.com
```

Push and pull use the hosted API — **users do not need AWS credentials**. S3 is configured only on the server.

For self-hosting with `arbor start`, copy `.env.example` to `.env` and set:

- `MONGODB_URL`
- `JWT_SECREAT_KEY`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` (for S3 storage)

## Requirements

- Node.js 18+

## License

ISC
