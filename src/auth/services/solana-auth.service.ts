import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdentityMethodModel } from '../../orm/model/identity-method.model';
import { SolanaIdentityProvider } from '../../providers/solana-identity.provider';
import { Role } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { SolanaLoginDto } from '../dto/solana-login.dto';
import { MEMO_TEXT } from '../entities/auth-challenge.entity';
import { IdentityMethodEntity, IdentityProvider } from '../entities/identity-method.entity';
import { TokenSetEntity } from '../entities/token-set.entity';
import { TokenIssuerService } from './token-issuer.service';

@Injectable()
export class SolanaAuthService {
  constructor(
    private readonly solanaIdentityProvider: SolanaIdentityProvider,
    private readonly tokenIssuerService: TokenIssuerService,
    private readonly userService: UserService,
    @InjectRepository(IdentityMethodModel)
    private readonly identityMethodRepo: Repository<IdentityMethodModel>,
  ) {}

  async signIn({ signature, desiredWallet }: SolanaLoginDto): Promise<TokenSetEntity> {
    /**
     * Verify the signature
     */
    const isVerified = this.solanaIdentityProvider.verifySignature({
      rawMessage: MEMO_TEXT,
      signature: signature,
      walletAddress: desiredWallet,
    });
    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const { id, userId } = await this.findOrCreateNewUserWithIdentityMethod(desiredWallet);

    return this.tokenIssuerService.grantSignInAccessToken({
      actorId: userId,
      identityMethodId: id,
    });
  }

  async findOrCreateNewUserWithIdentityMethod(walletAddress: string): Promise<IdentityMethodEntity> {
    const existedMethod = await this.identityMethodRepo.findOneBy({
      Identity: walletAddress,
      provider: IdentityProvider.SOLANA,
    });
    if (existedMethod) {
      return existedMethod;
    }

    const user = await this.userService.createUser({ roles: [Role.User] });

    return this.identityMethodRepo.save({
      userId: user.id,
      provider: IdentityProvider.SOLANA,
      Identity: walletAddress,
    });
  }
}
