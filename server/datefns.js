const { DateTime } = require('luxon');

exports.getTodayWithoutTime = () => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);

  return today;
}

exports.getSundayWithoutTime = () => {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const newDate = new Date(today.setDate(diff));
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

exports.getWeekdaysBetween = (start, end) => {
  let index = new Date(start);
  const weekdays = [];
  while (index <= end) {
    const dayOfWeek = index.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      weekdays.push(new Date(index));
    }
    index.setDate(index.getDate() + 1);
  }
  return weekdays;
}

exports.getLuxonDate = (date) => {
  let theDate = DateTime.fromJSDate(date);
  if (theDate.invalid) {
    theDate = DateTime.fromISO(date);
  }
  return theDate;
}
