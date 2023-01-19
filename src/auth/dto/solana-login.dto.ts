import { IsString } from 'class-validator';

export class SolanaLoginDto {
  @IsString()
  authChallengeId: number;

  @IsString()
  desiredWallet: string;

  /**
   * Base 58 encoded signature
   */
  @IsString()
  signature: string;
}
