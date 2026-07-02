const express = require('express');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simple in-memory "visits" counter to give load testing something to hit
let visitCount = 0;

// Root route
app.get('/', (req, res) => {
  visitCount++;
  res.json({
    message: 'DevOps Assignment App is running',
    hostname: os.hostname(),
    visits: visitCount,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint - used by load testing, monitoring, and ALB/CloudWatch checks
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime_seconds: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// A slightly heavier endpoint - useful for load testing to see CPU impact
app.get('/api/compute', (req, res) => {
  let sum = 0;
  for (let i = 0; i < 1e6; i++) {
    sum += Math.sqrt(i);
  }
  res.json({ result: sum, timestamp: new Date().toISOString() });
});

// Basic info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    app: 'devops-assignment-app',
    node_version: process.version,
    platform: os.platform(),
    memory_free_mb: Math.round(os.freemem() / 1024 / 1024),
    memory_total_mb: Math.round(os.totalmem() / 1024 / 1024),
    cpu_count: os.cpus().length,
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
