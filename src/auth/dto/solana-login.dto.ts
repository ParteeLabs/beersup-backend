import { IsString } from 'class-validator';

export class SolanaLoginDto {
  @IsString()
  authChallengeId: string;

  @IsString()
  desiredWallet: string;

  @IsString()
  signature: string;
}
