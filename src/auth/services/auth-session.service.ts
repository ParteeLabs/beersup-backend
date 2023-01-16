import { AuthSessionModel } from '../../orm/model/auth-session.model';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';

/**
 * @dev AuthSessionService handles all session related logic.
 */
export class AuthSessionService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(AuthSessionModel)
    private readonly AuthSessionRepo: Repository<AuthSessionModel>,
  ) {}

  public async findAuthSessionById(id: string): Promise<AuthSessionModel> {
    return this.AuthSessionRepo.findOne({ where: { id } });
  }

  public async endSession(userId: string, sessionId: string): Promise<void> {
    await this.entityManager.transaction(async (em) => {
      await em.delete(AuthSessionModel, { id: sessionId, actorId: userId });
    });
  }

  public async deleteAllSessions(userId: string): Promise<void> {
    await this.entityManager.transaction(async (em) => {
      await em.delete(AuthSessionModel, { actorId: userId });
    });
  }
}
