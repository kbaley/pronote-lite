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
  expect(breaks.length).toBe(3);
  expect(breaks[1].fromNoTimezone).toBe('Feb 11, 2022, 12:30 PM');
  expect(breaks[2].fromNoTimezone).toBe('Feb 11, 2022, 2:25 PM');
  startTime = getStartDate(2022, 1, 8);
  breaks = timetablefns.getBreaks(timetable['2022-02-08'], startTime.toISOString());
  expect(breaks.length).toBe(2);
  expect(breaks[1].fromNoTimezone).toBe('Feb 8, 2022, 2:25 PM');
});

test('can add breaks into a timetable', () => {
  const timetable = JSON.parse(fs.readFileSync('weeklyTimetableData.js', 'utf8'));
  const withBreaks = timetablefns.addBreaks(timetable, 10, 30);
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

test('can get timeslots', () => {
  const timetable = JSON.parse(fs.readFileSync('weeklyTimetableData.js', 'utf8'));
  const withBreaks = timetablefns.addBreaks(timetable, 10, 30);
  const results = timetablefns.getTimeslots(withBreaks);

  expect(results.length).toBe(8);
  expect(results[0]).toBe('10:30');
  expect(results[7]).toBe('16:55');
});

test('can calculate number of slots for an entry', () => {
  const timetable = JSON.parse(fs.readFileSync('weeklyTimetableData.js', 'utf8'));

  let slots = timetablefns.calculateTimeslots(timetable["2022-02-07"][0]);
  expect(slots).toBe(1);

  slots = timetablefns.calculateTimeslots(timetable["2022-02-11"][0]);
  expect(slots).toBe(2);
});
