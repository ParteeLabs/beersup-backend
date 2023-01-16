export enum IdentityProvider {
  SOLANA = 'SOLANA',
}

export class IdentityMethodEntity {
  id: string;

  userId: string;

  provider: IdentityProvider;

  Identity: string;
}
