import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  vus: 5000,
  duration: '30s',
};

export default function () {
  let res = http.get('http://localhost:3000/qa/questions?product_id=10');
  sleep(1);

  check(res, {
    'response code was 200s': (res) => res.status === 200,
    'duration less than 2000ms': (res) => res.timings.duration < 2000,
  });

}