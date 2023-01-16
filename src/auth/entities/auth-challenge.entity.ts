export const MEMO_TEXT = `Welcome to HamsterSwap!

Approve to sign in.

This request will not trigger a blockchain transaction or cost any gas fees.

Your authentication status will reset after 24 hours.`;

/**
 * @dev Define auth challenge entity.
 * 1) `AuthChallenge` will be used for proof of authorization request.
 * 2) `AuthChallenge` will be hashed as a check sum for the session verification later.
 */
export class AuthChallengeEntity {
  /**
   * @dev Target that the auth challenge is intended for.
   */
  public target: string;

  /**
   * @dev The memo string the auth challenge contains.
   */
  public memo: typeof MEMO_TEXT;

  /**
   * @dev Expiry date.
   */
  public expiryDate: number | string | Date;

  /**
   * @dev The challenge must be resolved after the session verification process.
   */
  public isResolved: boolean;

  /**
   * @dev Duration time that the auth challenge valid for.
   */
  public durationDelta: number;
}
