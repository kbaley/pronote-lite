require('dotenv').config();
const express = require("express");
const pronote = require('@dorian-eydoux/pronote-api');
const bodyParser = require('body-parser');
const jsonwebtoken = require('jsonwebtoken');
const auth = require('./auth.js');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const authenticateToken = require('./authenticateToken');
const path = require('path');

const PORT = process.env.PORT || 3001;
const PRONOTE_URL = process.env.PRONOTE_URL;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const app = express();
app.use(cookieParser());
app.use(sessions({
  secret: TOKEN_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
  resave: false,
}))

var expressSession;

app.use(express.static(path.resolve(__dirname, '../client/build')));

const jsonParser = bodyParser.json();

const getTodayWithoutTime = () => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  return today;
}

app.get("/api/timetable", authenticateToken, async (req, res) => {
  try {
    const today = getTodayWithoutTime();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const cachedTimetable = getCachedTimetable(req);
    if (cachedTimetable === null || cachedTimetable === '') {
      const session = await getSession(req);
      const timetable = await session.timetable(today, oneWeekFromNow);
      timetable.map( (entry) => {
        entry.fromDate = pronote.toPronoteDate(entry.from);
        entry.toDate = pronote.toPronoteDate(entry.to);
      });
      req.session.timetable = JSON.stringify(timetable);
      res.json(timetable);
    } else {
      res.json(JSON.parse(cachedTimetable));
    }
  } catch (error) {
    res.json(error);
  }
});

const getCachedTimetable = (req) => {
  if (!req.session || !req.session.timetable) {
    return null;
  }
  return req.session.timetable;
}

app.get("/api/homework", authenticateToken, async (req, res) => {
  try {

    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const session = await getSession(req);
    const homework = await session.homeworks(new Date(), oneWeekFromNow);
    homework.map( (entry) => {
      entry.forDate = pronote.toPronoteDate(entry.for);
    })
    res.json(homework);
  } catch (error) {
    res.json(error);
  }
});

const getSession = async (req) => {
  if (!req.session || !req.session.username || !req.session.password || !req.session.iv) {
    throw new Error("No credentials found in session");
  }
  const username = req.session.username;
  const iv = Buffer.from(req.session.iv, "hex");
  const password = auth.decrypt(req.session.password, iv);
  return await pronote.login(PRONOTE_URL, username, password);
}

app.get("/api/checkSession", (req, res) => {
  if (!req.session || !req.session.username || !req.session.password || !req.session.iv) {
    res.json({
      isLoggedIn: false,
      timezoneOffset: new Date().getTimezoneOffset()
    });
  } else {
    res.json({
      isLoggedIn: true,
      timezoneOffset: new Date().getTimezoneOffset()
    });
  }
});

app.post("/api/login", jsonParser, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const encrypted = auth.encrypt(password);
  const session = await pronote.login(PRONOTE_URL, username, password);
  expressSession = req.session;
  expressSession.username = username;
  expressSession.password = encrypted.encryptedData.toString('hex');
  expressSession.iv = encrypted.initVector.toString('hex');
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
      date: new Date(),
      username
    }
  });
});

app.post("/api/logout", async (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie("PLToken");
    res.send({message: "Logged out"});
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`PRONOTE URL: ${PRONOTE_URL}`);
  console.log(`Server listening on ${PORT}`);
});
