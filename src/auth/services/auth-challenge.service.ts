import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { DateTime } from 'luxon';

import { AuthChallengeModel } from '../../orm/model/auth-challenge.model';
import { AuthChallengeEntity, MEMO_TEXT } from '../entities/auth-challenge.entity';

/**
 * AuthChallengeService handles all auth challenge related logic
 */
@Injectable()
export class AuthChallengeService {
  constructor(
    /**
     * Inject auth challenge model.
     */
    @InjectRepository(AuthChallengeModel)
    private readonly AuthChallengeRepo: Repository<AuthChallengeModel>,
  ) {}

  public async generateAuthChallenge(target: string, delta = 60): Promise<AuthChallengeModel> {
    const payload: AuthChallengeEntity = {
      target,
      expiryDate: DateTime.now().plus({ seconds: delta }).toJSDate(),
      isResolved: false,
      durationDelta: delta,
      memo: MEMO_TEXT,
    };

    /**
     * Create new auth challenge.
     */
    return this.AuthChallengeRepo.save({
      ...payload,
      memo: MEMO_TEXT,
    });
  }

  /**
   * Resolve auth challenge.
   * @param authChallengeId
   */
  public async resolveAuthChallenge(authChallengeId: string) {
    /**
     * Find the id.
     */
    await this.AuthChallengeRepo.findOneOrFail({
      where: {
        id: authChallengeId,
      },
    });

    /**
     * Resolve the auth challenge, and save the status.
     */
    return this.AuthChallengeRepo.update({ id: authChallengeId }, { isResolved: true });
  }

  /**
   * Get latest auth challenge.
   * @param target
   */
  public async getLatestAuthChallenge(target: string): Promise<AuthChallengeModel | null> {
    /**
     * Find the latest doc.
     */
    return this.AuthChallengeRepo.findOne({
      where: {
        target,
        isResolved: false,
        expiryDate: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
