const { cipher } = require('@dorian-eydoux/pronote-api');
const crypto = require('crypto');

const PW_HASH = process.env.PW_HASH;
const algorithm = 'aes-256-cbc';

exports.encrypt = (message) => {

  const initVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(PW_HASH, "hex"), initVector);
  let encryptedData = cipher.update(message, "utf-8", "hex");
  encryptedData += cipher.final("hex");

  return {
    encryptedData,
    initVector
  }
}

exports.decrypt = (message, initVector) => {

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(PW_HASH, "hex"), initVector);
  let decryptedData = decipher.update(message, "hex", "utf-8");
  decryptedData += decipher.final("utf-8");

  return decryptedData.toString();
}
