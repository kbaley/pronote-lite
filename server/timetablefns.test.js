require('dotenv').config();
const timetablefns = require('./timetablefns');
const fs = require('fs');

const getStartDate = (year, month, day) => {
  return new Date(year, month, day, 7, 30, 0, 0);
}

test('can get breaks in a timetable', () => {
  const timetable = JSON.parse(fs.readFileSync('weeklyTimetableData.js', 'utf8'));
  let startTime = getStartDate(2022, 1, 11);  // Feb 11, 2022 @ 7:30AM
  let breaks = timetablefns.getBreaks(timetable['2022-02-11'], startTime.toISOString());
  expect(breaks.length).toBe(2);
  expect(breaks[0].fromNoTimezone).toBe('Feb 11, 2022, 9:30 AM');
  expect(breaks[1].fromNoTimezone).toBe('Feb 11, 2022, 11:25 AM');
  startTime = getStartDate(2022, 1, 8);
  breaks = timetablefns.getBreaks(timetable['2022-02-08'], startTime.toISOString());
  expect(breaks.length).toBe(1);
  expect(breaks[0].fromNoTimezone).toBe('Feb 8, 2022, 11:25 AM');
});

test('can add breaks into a timetable', () => {
  const timetable = JSON.parse(fs.readFileSync('weeklyTimetableData.js', 'utf8'));
  const withBreaks = timetablefns.addBreaks(timetable, 7, 30);
  expect(timetable['2022-02-07'].length).toBe(7);
  expect(timetable['2022-02-07'][4].subject).toBe('French');
  expect(withBreaks['2022-02-07'].length).toBe(8);
  expect(withBreaks['2022-02-07'][4].subject).toBe('BREAK');

  expect(timetable['2022-02-11'].length).toBe(5);
  expect(timetable['2022-02-11'][1].subject).toBe('Art');
  expect(withBreaks['2022-02-11'].length).toBe(7);
  expect(withBreaks['2022-02-11'][1].subject).toBe('BREAK');
  expect(withBreaks['2022-02-11'][3].subject).toBe('BREAK');
});
