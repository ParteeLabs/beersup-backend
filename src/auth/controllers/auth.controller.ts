import { AuthGuard } from '@nestjs/passport';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CommonApiResponse, CommonResponse } from '../../api-docs/api-response.decorator';
import { AuthChallengeEntity } from '../entities/auth-challenge.entity';
import { AuthChallengeDto } from '../dto/auth-challenge.dto';
import { AuthChallengeService } from '../services/auth-challenge.service';
import { AuthChallengeModel } from '../../orm/model/auth-challenge.model';
import { JwtAuthSession } from '../strategies/jwt.strategy';
import { AuthSessionService } from '../services/auth-session.service';
import { CurrentSession } from '../decorators/current-session.decorator';
import { LoginType, LoginTypeParamMap } from '../auth.config';
import { SolanaAuthService } from '../services/solana-auth.service';
import { TokenSetEntity } from '../entities/token-set.entity';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SolanaLoginDto } from '../dto/solana-login.dto';

@Controller('auth')
@ApiTags('auth')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
export class AuthController {
  constructor(
    private readonly sessionService: AuthSessionService,
    private readonly authChallengeService: AuthChallengeService,
    private readonly solanaAuthService: SolanaAuthService,
  ) {}

  @Post('/signin')
  public async signin(@Param('type') type: string, body: any): Promise<TokenSetEntity> {
    switch (LoginTypeParamMap[type]) {
      case LoginType.SOLANA: {
        const loginDto = plainToInstance(SolanaLoginDto, body);
        validateSync(loginDto);
        return this.solanaAuthService.signIn(loginDto);
      }
      default:
        throw new NotImplementedException(`This login type: "${type}" is not supported`);
    }
  }

  @CommonApiResponse(
    CommonResponse.UNAUTHORIZED_SESSION,
    CommonResponse.FORBIDDEN_SESSION,
    CommonResponse.WRONG_FIELD_FORMATS,
  )
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Logout from all sessions.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('/logout')
  public async logOutFromAllSessions(@CurrentSession() { user }: JwtAuthSession): Promise<void> {
    return this.sessionService.deleteAllSessions(user.id);
  }

  @CommonApiResponse(CommonResponse.WRONG_FIELD_FORMATS)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Request auth challenge.',
    type: AuthChallengeEntity,
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('/challenge/request')
  public async requestAuthChallenge(@Body() body: AuthChallengeDto): Promise<AuthChallengeModel> {
    return this.authChallengeService.generateAuthChallenge(body.target);
  }
}
