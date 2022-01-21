require('dotenv').config();
const jwt = require('jsonwebtoken');

const TOKEN_SECRET = process.env.TOKEN_SECRET;

module.exports = (req, res, next) => {

  if (!req.cookies || !req.cookies.PLToken) {
    return res.sendStatus(401);
  }

  const token = req.cookies.PLToken;
  jwt.verify(token, TOKEN_SECRET, (err) => {
    if (err) {
      return res.sendStatus(403);
    }
  });
  next();
}
