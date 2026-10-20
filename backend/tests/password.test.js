const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('../lib/password');

test('passwords are stored as salted scrypt hashes, not as plain text', async () => {
  const first = await hashPassword('correct horse battery staple');
  const second = await hashPassword('correct horse battery staple');

  assert.notEqual(first, 'correct horse battery staple');
  assert.notEqual(first, second);
  assert.match(first, /^scrypt\$[a-f0-9]{32}\$[a-f0-9]{128}$/);

  const result = await verifyPassword('correct horse battery staple', first);
  assert.deepEqual(result, { valid: true, needsRehash: false });
});

test('password verification rejects an incorrect password', async () => {
  const stored = await hashPassword('correct horse battery staple');
  const result = await verifyPassword('incorrect password', stored);

  assert.deepEqual(result, { valid: false, needsRehash: false });
});

test('legacy plain-text records can be migrated after a successful login', async () => {
  const result = await verifyPassword('legacy-password', 'legacy-password');

  assert.deepEqual(result, { valid: true, needsRehash: true });
});
