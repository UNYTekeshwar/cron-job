A) Droplet (classic Linux cron)
1) Put your Node script on the Droplet
ssh node@YOUR_DROPLET_IP
mkdir -p ~/apps/my-cron-task && cd ~/apps/my-cron-task
nano job.js


job.js

import 'dotenv/config';
async function main() {
  const t0 = Date.now();
  console.log(new Date().toISOString(), 'job start');
  // TODO: your logic (DB cleanup, API call, etc.)
  console.log(new Date().toISOString(), 'job done in', Date.now() - t0, 'ms');
}

main().then(()=>process.exit(0)).catch(err => {
  console.error('job failed:', err);
  process.exit(1);
});


If you use CommonJS:
require('dotenv').config();
// same main() as above…


Install Node (if needed) with nvm:

curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
node -v

or

sudo apt install node
sudo apt install npm

Optional deps:

npm init -y
npm i dotenv
mkdir -p logs


Test once:

node job.js

2) Add the cron entry

Open your crontab:

crontab -e


Recommended cron line (runs every day at 02:30, logs to file):

SHELL=/bin/bash
pwd for check the cmd

# Load nvm environment via login shell, then run the script
30 2 * * * bash -lc 'cd /home/node/apps/my-cron-task && node job.js >> logs/cron.log 2>&1'


Why bash -lc? It loads your ~/.bashrc so nvm’s Node is on PATH.
Prefer UTC or set server timezone: sudo timedatectl set-timezone Asia/Kolkata.

Examples

Every 5 minutes:

*/5 * * * * bash -lc 'cd /home/node/apps/my-cron-task && node job.js >> logs/cron.log 2>&1'


At 09:00 Mon–Fri:

0 9 * * 1-5 bash -lc 'cd /home/node/apps/my-cron-task && node job.js >> logs/cron.log 2>&1'

3) Verify / troubleshoot
crontab -l                           # see your entries
systemctl status cron                # cron service status
tail -f ~/apps/my-cron-task/logs/cron.log   # live job output
which node                           # if cron can’t find node, use absolute path


If you prefer absolute path (no bash -lc), replace with your Node path:

30 2 * * * cd /home/node/apps/my-cron-task && /home/node/.nvm/versions/node/v20.x.x/bin/node job.js >> logs/cron.log 2>&1


Gotchas

Permissions: chown -R node:node ~/apps/my-cron-task

Env vars: use .env + dotenv or export in crontab:

# in crontab (above the schedule lines)
NODE_ENV=production
API_URL=https://example.com