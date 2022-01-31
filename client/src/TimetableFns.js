import { filter, sortBy } from 'lodash';
import moment from 'moment';

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
  today = setTime(today, 0, 0);
  if (timetable.length === 0) {
    return today;
  }
  const futureEntries = filter(timetable, entry => entry.from >= today);
  if (futureEntries.length === 0) {
    return today;
  }
  today = sortBy(futureEntries, ['from'] )[0].from;
  return setTime(today, 0, 0);
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

export const getDateWithoutTime = (date) => {
  return moment(date).format('MMM DD');
}

const setTime = (date, hour, minutes) => {
  const newDate = new Date(date);
  newDate.setHours(hour);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}
