export class AuthSessionEntity {
  authorizedPartyId: string;

  actorId: number;

  expiryDate: Date;

  /**
   * Checksum hash of authorizedPartyId + actorId + expiryDate
   */
  checksum: string;
}
