import 'dotenv/config';
import fetch from 'node-fetch';

// 👉 Put your logic in here. Keep it idempotent.
async function main() {
  const started = new Date();
  console.log(`[${started.toISOString()}] Job start`);

  // Example: ping an API, handle response, then do something (e.g., DB cleanup).
  const url = process.env.API_URL || 'https://httpbin.org/get';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  // Simulate some work
  console.log('Fetched keys:', Object.keys(data));

  const finished = new Date();
  console.log(`[${finished.toISOString()}] Job done in ${finished - started}ms`);
}

// Run and set proper exit codes for cron to detect failures
main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Job failed:', err?.stack || err);
    process.exit(1);
  });