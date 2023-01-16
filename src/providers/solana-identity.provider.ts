// eslint-disable-next-line
import TwS from 'tweetnacl';
import * as Bs from 'bs58';

type SolanaSignatureData = {
  rawMessage: string;
  signature: string;
  walletAddress: string;
};

export class SolanaIdentityProvider {
  verifySignature({ rawMessage, signature, walletAddress }: SolanaSignatureData): boolean {
    return TwS.sign.detached.verify(
      new TextEncoder().encode(rawMessage), // UTF-8
      Bs.decode(signature), // Base58
      Bs.decode(walletAddress), // Base58
    );
  }
}
