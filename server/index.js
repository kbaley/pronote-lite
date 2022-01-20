require('dotenv').config();
const express = require("express");
const pronote = require('@dorian-eydoux/pronote-api');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const auth = require('./auth.js');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3001;
const PRONOTE_URL = process.env.PRONOTE_URL;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const app = express();
app.use(cookieParser());

const jsonParser = bodyParser.json();
let session;

app.get("/api/timetable", async (req, res) => {
  try {
  const timetable = await session.timetable();
  res.json(timetable);
  } catch (error) {
    res.json(error);
  }
});

app.get("/api/homework", async (req, res) => {
  try {

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    getSession(req);
    return {message: "done"}
    const homework = await session.homeworks(new Date(), oneWeekFromNow);
    res.json(homework);
  } catch (error) {
    res.json(error);
  }
});

const getSession = (req) => {
  if (!req.cookies || !req.cookies.PLToken) {
    return null;
  }
  const token = req.cookies.PLToken;
  console.log(jsonwebtoken.verify(token, TOKEN_SECRET));
  console.log(decodedToken);
}

app.post("/api/login", jsonParser, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const encrypted = auth.encrypt(password);
  session = await pronote.login(PRONOTE_URL, username, password);
  const authToken = jsonwebtoken.sign({
    username: username,
    key: encrypted.encryptedData.toString('hex'),
    iv: encrypted.initVector.toString('hex')
  }, TOKEN_SECRET);
  res.cookie('PLToken', authToken, { httpOnly: true });
  res.json({ authToken,
    user: {
      id: session.user.id,
      name: session.user.name,
      username
    }
  });
});

app.listen(PORT, () => {
    console.log(`PRONOTE URL: ${PRONOTE_URL}`);
    console.log(`Server listening on ${PORT}`);
});
