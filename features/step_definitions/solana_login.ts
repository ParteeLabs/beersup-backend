import { Then } from '@cucumber/cucumber';
import Nacl from 'tweetnacl';
import Bs from 'bs58';

import { SolanaLoginDto } from '../../src/auth/dto/solana-login.dto';
import { MEMO_TEXT } from '../../src/auth/entities/auth-challenge.entity';
import { getState } from './state';
import { getBeersupBEClient } from './clients';
import { TokenSetEntity } from '../../src/auth/entities/token-set.entity';

Then('request solana login with {validity} auth', async function (validity: string) {
  const state = getState(this);
  const { authChallengeId, solanaValidKeyPair } = state;

  const req: SolanaLoginDto = {
    authChallengeId,
    desiredWallet: '',
    signature: Bs.encode(Nacl.sign.detached(new TextEncoder().encode(MEMO_TEXT), solanaValidKeyPair.secretKey)),
  };
  switch (validity) {
    case 'valid':
      req.desiredWallet = solanaValidKeyPair.publicKey.toString();
      break;
    case 'invalid':
      req.desiredWallet = 'SomeRandomStringActAsAddress';
      break;
  }

  const response = await getBeersupBEClient().post('/v1/signin').send(req);
  state.response = response;
  if (state.response.status == 201) {
    state.accessToken = (response.body as TokenSetEntity).accessToken;
  }
});
