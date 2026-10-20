const { randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;
const FORMAT = 'scrypt';

async function hashPassword(password) {
  if (typeof password !== 'string' || password.length === 0 || password.length > 1024) {
    throw new TypeError('Password must be a non-empty string no longer than 1024 characters.');
  }

  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `${FORMAT}$${salt}$${Buffer.from(derivedKey).toString('hex')}`;
}

async function verifyPassword(password, storedValue) {
  if (typeof password !== 'string' || typeof storedValue !== 'string') {
    return { valid: false, needsRehash: false };
  }

  const [format, salt, storedHex, extra] = storedValue.split('$');
  if (format === FORMAT && salt && storedHex && !extra && /^[a-f0-9]{128}$/i.test(storedHex)) {
    const derivedKey = Buffer.from(await scrypt(password, salt, KEY_LENGTH));
    const expected = Buffer.from(storedHex, 'hex');
    return {
      valid: derivedKey.length === expected.length && timingSafeEqual(derivedKey, expected),
      needsRehash: false,
    };
  }

  // Compatibility path for older development records; a valid login upgrades the value immediately.
  const supplied = Buffer.from(password);
  const legacy = Buffer.from(storedValue);
  const valid = supplied.length === legacy.length && timingSafeEqual(supplied, legacy);
  return { valid, needsRehash: valid };
}

module.exports = { hashPassword, verifyPassword };
