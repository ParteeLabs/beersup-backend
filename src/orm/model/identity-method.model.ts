import { Column } from 'typeorm';
import { IdentityMethodEntity, IdentityProvider } from '../../auth/entities/identity-method.entity';
import { BaseModel } from '../base.model';

export class IdentityMethodModel extends BaseModel implements IdentityMethodEntity {
  @Column({ type: Number })
  userId: number;

  @Column({ type: String, enum: IdentityProvider })
  provider: IdentityProvider;

  @Column({ type: String })
  Identity: string;
}
