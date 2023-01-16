import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

/**
 * Import infra providers.
 */
import { AuthController } from './controllers/auth.controller';
import { JwtProvider } from '../providers/hash/jwt.provider';
import { OrmModule } from '../orm/orm.module';

/**
 * Import logic providers.
 */
import { UserService } from '../user/services/user.service';
import { TokenIssuerService } from './services/token-issuer.service';
import { BCryptHashProvider } from '../providers/hash/hashing.provider';
import { JwtAuthStrategy } from './strategies/jwt.strategy';
import { RegistryProvider } from '../providers/registry.provider';
import { AuthChallengeService } from './services/auth-challenge.service';
import { AuthSessionService } from './services/auth-session.service';
import { AvatarProvider } from '../providers/avatar.provider';

@Module({
  controllers: [AuthController],
  imports: [
    /**
     * import ORM modules so that we can use models.
     */
    OrmModule,
    /**
     * Configure nestjs passport jwt module.
     */
    JwtModule.registerAsync({
      /**
       * Define module factory.
       */
      useFactory: async () => {
        /**
         * Use jwtService to extract metadata.
         */
        const jwtService = new JwtProvider(new RegistryProvider());

        /**
         * Binding credentials for jwt signing and verifying.
         */
        const options: JwtModuleOptions = {
          secret: jwtService.getKeyPair().privateKey,
          privateKey: jwtService.getKeyPair().privateKey,
          publicKey: jwtService.getKeyPair().publicKey,
          signOptions: jwtService.getSignOptions(),
        };

        /**
         * return options.
         */
        return options;
      },
    }),
  ],
  providers: [
    /**
     * Import services
     */
    TokenIssuerService,
    UserService,
    AuthChallengeService,
    AuthSessionService,

    /**
     * Import providers.
     */
    RegistryProvider,
    JwtProvider,
    BCryptHashProvider,
    AvatarProvider,

    /**
     * Import strategy
     */
    JwtAuthStrategy,
  ],
})
export class AuthModule {}
