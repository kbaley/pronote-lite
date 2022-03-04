const e = require('express');
const _ = require('lodash');
const { DateTime } = require('luxon');

exports.addBreaks = (groupedEntries, startHour, startMinute) => {

  const newList = {};
  _.forEach(groupedEntries, (entries, key) => {
    const sorted = _.sortBy(entries, (e) => { return e.from});
    if (sorted.length > 0) {
      let startDate = new Date(sorted[0].from);
      startDate.setHours(startHour);
      startDate.setMinutes(startMinute);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      const breaks = getBreaks(sorted, startDate);
      _.forEach(breaks, b => sorted.push(b));
    }
    newList[key] = _.clone(_.sortBy(sorted, (s) => { return s.from }));
  });
  return newList;
};

exports.getTimeslots = (timetable) => {
  const allSlots = _
    .flatten(_
      .map(timetable, (day) => 
        _.map(day, 
          (entry) => getTimeString(entry.from))));
  const slots = _.uniq(allSlots);
  slots.sort();
  return slots;
}

exports.calculateTimeslots = (entry) => {
  const start = DateTime.fromISO(entry.from);
  const end = DateTime.fromISO(entry.to);

  const diff = end.diff(start, ["minutes"]);
  console.log(diff.minutes / 60);
  return Math.round(diff.minutes / 60);
}

const getTimeString = (date) => {
  return DateTime.fromJSDate(new Date(date)).toLocaleString(DateTime.TIME_24_SIMPLE);
}

const getBreaks = (dayEntries, endTime) => {
  const newEntries = [];
  for (let i = 0; i < dayEntries.length; i++) {
    const dayEntry = dayEntries[i];
    const endTimeDate = new Date(endTime);
    const fromDate = new Date(dayEntry.from);
    const diff = Math.abs(DateTime.fromJSDate(endTimeDate).diff(DateTime.fromJSDate(fromDate), 'minutes').minutes);
    if (diff > 15) {
      newEntries.push({
        from: endTime,
        subject: 'BREAK',
        teacher: '',
        color: '#eee',
        position: i,
        id: Math.random(),
       fromNoTimezone: DateTime.fromJSDate(endTimeDate).toLocaleString(DateTime.DATETIME_MED)
      });
    }
    endTime = dayEntry.to;
  }
  return newEntries;
}

exports.getBreaks = getBreaks;
