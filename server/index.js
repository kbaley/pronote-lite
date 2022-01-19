require('dotenv').config();
const express = require("express");
const pronote = require('@dorian-eydoux/pronote-api');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const auth = require('./auth.js');

const PORT = process.env.PORT || 3001;
const PRONOTE_URL = process.env.PRONOTE_URL;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const app = express();
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
    const homework = await session.homeworks(new Date(), oneWeekFromNow);
    res.json(homework);
  } catch (error) {
    res.json(error);
  }
});


app.post("/api/login", jsonParser, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const encrypted = auth.encrypt(password);
  session = await pronote.login(PRONOTE_URL, username, password);
  const authToken = jwt.sign({
    username: username,
    key: encrypted.encryptedData.toString('hex'),
    iv: encrypted.initVector.toString('hex')
  }, TOKEN_SECRET);
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
