import { When } from '@cucumber/cucumber';
import { getState } from './state';
import { getBeersupBEClient } from './clients';
import { AuthChallengeEntity } from '../../src/auth/entities/auth-challenge.entity';

When('request auth challenge', async function () {
  const state = getState(this);
  const response = await getBeersupBEClient()
    .post('/v1/auth/challenge/request')
    .set('Accept', 'application/json')
    .send({
      target: state.authChallengeTarget,
    });
  state.response = response;

  if (state.response.status == 201) {
    state.authChallengeId = (response.body as AuthChallengeEntity).id;
  }
});
