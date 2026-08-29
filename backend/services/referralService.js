/**
 * Referral Service
 *
 * Minimal referral-code service: generates, validates, and tracks
 * referral codes in memory. This module is a backend service with no
 * DOM/UI surface — see README_REFERRAL_SERVICE.md for the accessibility
 * ticket note (Issue: keyboard operability does not apply here).
 */

import crypto from 'crypto';

const CODE_BYTE_LENGTH = 4;
const referralCodes = new Map(); // code -> { owner, createdAt, uses }

/**
 * Generate a new referral code for the given owner address.
 * @param {string} owner - Stellar address that owns the referral code.
 * @returns {string} The generated referral code.
 */
function generateReferralCode(owner) {
  const code = crypto.randomBytes(CODE_BYTE_LENGTH).toString('hex');
  referralCodes.set(code, { owner, createdAt: new Date(), uses: 0 });
  return code;
}

/**
 * Validate that a referral code exists and is usable.
 * @param {string} code - Referral code to validate.
 * @returns {boolean} True if the code exists.
 */
function isValidReferralCode(code) {
  return referralCodes.has(code);
}

/**
 * Record a use of a referral code.
 * @param {string} code - Referral code being redeemed.
 * @returns {Object|null} Updated referral record, or null if not found.
 */
function recordReferralUse(code) {
  const record = referralCodes.get(code);
  if (!record) return null;
  record.uses += 1;
  return record;
}

/**
 * Get referral stats for an owner's code.
 * @param {string} code - Referral code to look up.
 * @returns {Object|null} Referral record, or null if not found.
 */
function getReferralStats(code) {
  return referralCodes.get(code) || null;
}

export default {
  generateReferralCode,
  isValidReferralCode,
  recordReferralUse,
  getReferralStats,
};
