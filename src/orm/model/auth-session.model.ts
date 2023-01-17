import { Column, Entity, Index } from 'typeorm';
import { AuthSessionEntity } from '../../auth/entities/auth-session.entity';

import { BaseModel } from '../base.model';

/**
 * Define model.
 */
@Entity({
  name: 'auth_session',
})
export class AuthSessionModel extends BaseModel implements AuthSessionEntity {
  /**
   * userId
   */
  @Column({ type: Number })
  @Index('actorId_idx')
  readonly actorId: number;

  @Column({ type: String })
  @Index('authorizedPartyId_idx')
  readonly authorizedPartyId: string;

  @Column({ type: String })
  @Index('checksum_uidx', { unique: true })
  readonly checksum: string;

  @Column({ type: 'timestamptz' })
  readonly expiryDate: Date;
}
