require('dotenv').config();
const auth = require('./auth');

test('can encrypt and decrypt data', () => {
  const result = auth.encrypt("Hello world");
  const iv = result.initVector;
  const data = result.encryptedData;
  const decrypted = auth.decrypt(data, iv);
  expect(decrypted).toBe("Hello world");
});

test('can encrypt and decrypt after converting iv to string', () => {
  const result = auth.encrypt("Hello world");
  const iv = result.initVector;
  const ivString = iv.toString("hex");
  const data = result.encryptedData;
  const decrypted = auth.decrypt(data, Buffer.from(ivString, "hex"));
  expect(decrypted).toBe("Hello world");
});
