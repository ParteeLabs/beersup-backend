/**
 * Declare auth session entity.
 */
export class AuthSessionEntity {
  /**
   * Declare that the session was authorized for a party.
   */
  authorizedPartyId: string;

  /**
   * Declare actor that authorized this session.
   */
  actorId: string;

  /**
   * Declare date/
   */

  expiryDate: Date;
  /**
   * Checksum hash.
   */
  checksum: string;
}
