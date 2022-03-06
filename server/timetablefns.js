const _ = require('lodash');
const { DateTime } = require('luxon');
const { getLuxonDate } = require('./datefns');

const TIME_SLOTS = ['07:30', '08:25', '09:15', '10:20', '11:15', '12:15', '13:00', '13:55'];
const LUNCH_SLOT = '12:15';
const START_HOUR = 7;
const START_MINUTE = 30;
const END_HOUR = 14;
const END_MINUTE = 45;

exports.addBreaks = (groupedEntries, startHour, startMinute, endHour, endMinute) => {

  const newList = {};
  _.forEach(groupedEntries, (entries, key) => {
    const sorted = _.sortBy(entries, (e) => { return e.from});
    if (sorted.length > 0) {
      let startDate = new Date(sorted[0].from);
      startDate.setHours(startHour || START_HOUR);
      startDate.setMinutes(startMinute || START_MINUTE);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      const endDate = new Date(startDate);
      endDate.setHours(endHour || END_HOUR);
      endDate.setMinutes(endMinute || END_MINUTE);
      const breaks = getBreaks(sorted, startDate, endDate);
      _.forEach(breaks, b => sorted.push(b));
    }
    newList[key] = _.clone(_.sortBy(sorted, (s) => { return s.from }));
  });
  return newList;
};

exports.getTimeslots = (timetable) => {
  return TIME_SLOTS;
  // const allSlots = _
  //   .flatten(_
  //     .map(timetable, (day) => 
  //       _.map(day, 
  //         (entry) => getTimeString(entry.from))));
  // const slots = _.uniq(allSlots);
  // slots.sort();
  // return slots;
}

exports.calculateTimeslots = (entry) => {
  const start = getLuxonDate(entry.from);
  const end = getLuxonDate(entry.to);

  const diff = end.diff(start, ["minutes"]);
  return Math.round(diff.minutes / 60);
}

const getTimeString = (date) => {
  return DateTime.fromJSDate(new Date(date)).toLocaleString(DateTime.TIME_24_SIMPLE);
}

const calculateBreakSlotSize = (startTime, endTime) => {
  const start = getLuxonDate(startTime);
  const end = getLuxonDate(endTime);
  const diff = Math.abs(end.diff(start, 'minutes').minutes);
  return Math.round(diff / 60);
}

const getBreaks = (dayEntries, startingTime, endingTime) => {
  const newEntries = [];
  const lastSlotEndTime = new Date(endingTime);
  for (let i = 0; i < dayEntries.length; i++) {
    const dayEntry = dayEntries[i];
    const endTimeDate = new Date(startingTime);
    const fromDate = new Date(dayEntry.from);
    const diff = Math.abs(getLuxonDate(endTimeDate).diff(getLuxonDate(fromDate), 'minutes').minutes);
    if (diff > 15) {
      const slotSize = calculateBreakSlotSize(
        startingTime,
        i < dayEntries.length ? new Date(dayEntries[i].from) : lastSlotEndTime
      );
      newEntries.push({
        from: startingTime,
        subject: getLuxonDate(startingTime).toFormat('hh:mm') === LUNCH_SLOT ? 'LUNCH' : 'BREAK',
        teacher: '',
        color: '#eee',
        position: i,
        id: Math.random(),
        fromNoTimezone: DateTime.fromJSDate(endTimeDate).toLocaleString(DateTime.DATETIME_MED),
        slots: slotSize
      });
    }
    startingTime = dayEntry.to;
  }
  return newEntries;
}

exports.getBreaks = getBreaks;
