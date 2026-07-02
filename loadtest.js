import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // ramp up to 20 users over 1 min
    { duration: '2m', target: 50 },   // ramp up to 50 users over 2 min
    { duration: '1m', target: 0 },    // ramp down
  ],
};

export default function () {
  // Hit the health check endpoint
  const healthRes = http.get('https://16-171-153-87.nip.io/api/health');
  check(healthRes, { 'health status 200': (r) => r.status === 200 });

  // Hit the CPU-heavy endpoint to generate real load
  const computeRes = http.get('https://16-171-153-87.nip.io/api/compute');
  check(computeRes, { 'compute status 200': (r) => r.status === 200 });

  sleep(1);
}