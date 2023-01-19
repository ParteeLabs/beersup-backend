import { Then } from '@cucumber/cucumber';
import { getState } from './state';

Then('systems returns status code {code}', async function (code: string) {
  const state = getState(this);
  if (state.response.status != +code) {
    throw new Error(`Unexpected status code. Want: ${code}, got: ${state.response.status}`);
  }
});
