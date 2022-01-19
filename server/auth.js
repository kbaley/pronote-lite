const crypto = require('crypto');

const PW_HASH = process.env.PW_HASH;
const algorithm = 'aes-256-cbc';

exports.encrypt = (message) => {

  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, PW_HASH, initVector);
  let encryptedData = cipher.update(message, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return {
    encryptedData,
    initVector
  }
}
