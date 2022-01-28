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
const { DateTime } = require('luxon');

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
  today.setMilliseconds(0);

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
      // The from and to dates ignore the timezone of the server where this is retrieved. E.g. if a
      // class starts at 7:30AM time on January 1 in the school's time zone, then the from time
      // retrieved from the server is "January 1, 2022 7:30AM". If the server is in a different time zone
      // than the school, this causes problems. E.g. if the school is in Panama (-0500) and the server
      // is in London, then the from time for the previous example will get returned as 
      // "January 1, 2022 7:30AM" in the server's time zone which is actually "January 1, 2022 2:30AM" in
      // the local (Panamanian) time zone. To combat this, we add another parameter to each entry
      // that strips the time zone off. It will be added back in on the client so as long as the client
      // is in the school's time zone, this will work.
      for (let i = 0; i < timetable.length; i++) {
        const entry = timetable[i];
        entry.fromNoTimezone = DateTime.fromJSDate(entry.from).toLocaleString(DateTime.DATETIME_MED);
        entry.toNoTimezone = DateTime.fromJSDate(entry.to).toLocaleString(DateTime.DATETIME_MED);
      }
      console.log(timetable);
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
    const today = getTodayWithoutTime();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
    const session = await getSession(req);
    const homework = await session.homeworks(today, oneWeekFromNow);
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
