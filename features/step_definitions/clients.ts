import request from 'supertest';

export function getBeersupBEClient() {
  return request('https://' + process.env.BEERSUP_BE);
}
