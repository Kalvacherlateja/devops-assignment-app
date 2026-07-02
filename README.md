# devops-assignment-app

Minimal Express app built for the DevOps AWS technical assignment. Deliberately simple — the assignment grades DevOps execution (infra, CI/CD, security, monitoring, load testing), not app complexity.

## Endpoints
- `GET /` — basic info + visit counter
- `GET /api/health` — health check (used by CI/CD, monitoring, load testing)
- `GET /api/compute` — CPU-heavy endpoint, useful for generating load in k6 tests
- `GET /api/info` — runtime/host info (node version, memory, CPU count)

## Local run
```bash
npm install
npm start
# visit http://localhost:3000
```

## Deploy to EC2 (manual, first time)
```bash
git clone <your-repo-url> app
cd app
npm ci --omit=dev
sudo npm install -g pm2   # if not already installed
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # follow the printed instructions to enable pm2 on boot
```

Then configure nginx as a reverse proxy — see `nginx-app.conf` in this repo for the config to copy onto the EC2 instance.

## CI/CD (GitHub Actions)
On every push to `main`, `.github/workflows/deploy.yml` runs tests then SSHes into EC2 to `git pull`, reinstall deps, and restart the app via pm2.

**Required GitHub repo secrets** (Settings → Secrets and variables → Actions):
| Secret | Value |
|---|---|
| `EC2_HOST` | Your EC2 public IP or domain |
| `EC2_SSH_KEY` | Full contents of your `.pem` private key |

## Notes
- Uses `pm2` for process management (auto-restart on crash, survives SSH disconnect).
- `/api/compute` is intentionally CPU-heavy to make load testing results more interesting (watch CPU climb under k6/Locust load).
