import React from 'react';
import { Box } from '@mui/material';
import moment from 'moment';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { groupBy, forEachRight, clone, filter } from 'lodash';
import TimetableHeader from './TimetableHeader';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
}
const Timetable  = ({timetable}) => {
  const [firstDay, setFirstDay] = React.useState([]);
  const [date, setDate] = React.useState("");

  const getDefaultDate = () => {

    let today = new Date();
    if (today.getHours() >= 14) {
      today.setDate(today.getDate() + 1);
    }
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  }

  React.useEffect(() => {
    const getDateWithoutTime = (date) => {
      return moment(date).format('MMM DD');
    }

    const getBreaks = (dayEntries, endTime) => {
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

    const dateToUse = timetable.length > 0 ? timetable[0].from : new Date();
    let startDate = new Date(dateToUse);
    startDate.setHours(7);
    startDate.setMinutes(30);
    startDate.setSeconds(0);
    const dateFormatted = getDateWithoutTime(dateToUse);
    setDate(dateFormatted);

    const filtered = filter(timetable, (entry) => entry.status !== "Cours annulé");
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
    const keys = Object.keys(grouped);
    if (timetable.length > 0) {
      const dayEntries = clone(grouped[keys[0]]);
      const newEntries = getBreaks(dayEntries, startDate);
      forEachRight(newEntries, newEntry => {
        dayEntries.splice(newEntry.position, 0, newEntry);
      });
      setFirstDay(dayEntries);
    } else {
      setFirstDay([]);
    }
  }, [timetable]);

  return (
    <Box
      component="span"
      sx={boxSx}
    >
      <Header text="Timetable" visible={timetable.length > 0} />
      <TimetableHeader day={firstDay.length > 0 ? date : ""} />
      {firstDay.map((entry) => (
        <TimetableEntry
          entry={entry}
          key={entry.id}
        />
      ))}
    </Box>
  )
}

export default Timetable;
