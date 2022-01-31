import { filter, sortBy } from 'lodash';
import moment from 'moment';

export const clearTime = (date) => {
  const clone = new Date(date);
  clone.setHours(0);
  clone.setMinutes(0);
  clone.setSeconds(0);
  clone.setMilliseconds(0);

  return clone;
}

const addDays = (date, days) => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export const tomorrow = (date) => {
  return addDays(date, 1);
}

export const yesterday = (date) => {
  return addDays(date, -1);
}

export const getFirstDate = (timetable) => {

  let today = new Date();
  if (today.getHours() >= 14) {
    today.setDate(today.getDate() + 1);
  }
  today = clearTime(today);
  if (timetable.length === 0) {
    return today;
  }
  const futureEntries = filter(timetable, entry => entry.from >= today);
  if (futureEntries.length === 0) {
    return today;
  }
  today = sortBy(futureEntries, ['from'] )[0].from;
  return clearTime(today);
}
export const getBreaks = (dayEntries, endTime) => {
  const newEntries = [];
  for (let i = 0; i < dayEntries.length; i++) {
    const dayEntry = dayEntries[i];
    const diff = Math.abs(moment(endTime).diff(moment(dayEntry.from), 'minutes'));
    if (diff > 15) {
      newEntries.push({
        from: endTime,
        subject: 'BREAK',
        teacher: '',
        color: '#eee',
        position: i,
        id: Math.random(),
      });
    }
    endTime = dayEntry.to;
  }
  return newEntries;
}
