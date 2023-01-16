import { IsString } from 'class-validator';

export class SolanaLoginDto {
  @IsString()
  desiredWallet: string;

  @IsString()
  signature: string;
}
