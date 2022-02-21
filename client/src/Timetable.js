import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { groupBy, forEachRight, clone, filter, minBy } from 'lodash';
import TimetableHeader from './TimetableHeader';
import {
  getFirstDate,
  tomorrow,
  yesterday,
  getBreaks,
  getDateWithoutTime,
  setTime,
} from './TimetableFns';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
  width: '100%',
}
const Timetable  = ({timetable, show}) => {
  const [dayEntries, setDayEntries] = React.useState([]);
  const [date, setDate] = React.useState("");
  const firstDate = getFirstDate(timetable);
  const [currentDate, setCurrentDate] = React.useState(firstDate);
  const [minDate, setMinDate] = React.useState(null);
  const [groupedTimetable, setGroupedTimetable] = React.useState([]);

  const goToPreviousDay = () => {
    setCurrentDate(yesterday(currentDate));
  }

  const goToNextDay = () => {
    setCurrentDate(tomorrow(currentDate));
  }

  React.useEffect(() => {
    setCurrentDate(getFirstDate(timetable));
    const filtered = filter(timetable, (entry) => entry.status !== "Cours annulé");
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
    const min = minBy(filtered, (entry) => entry.from);
    if (min && min.from) {
      const minDate = setTime(new Date(min.from), 0, 0);
      console.log()
      setMinDate(minDate);
    }
    setGroupedTimetable(grouped);
  }, [timetable]);

  React.useEffect(() => {
    let startDate = new Date(currentDate);
    startDate.setHours(7);
    startDate.setMinutes(30);
    startDate.setSeconds(0);
    const dateFormatted = getDateWithoutTime(currentDate);
    setDate(dateFormatted);

    const keys = Object.keys(groupedTimetable);
    const selectedKey = keys.find(k => k === dateFormatted);
    if (keys.length > 0 && selectedKey) {
      const entries = clone(groupedTimetable[selectedKey]);
      const newEntries = getBreaks(entries, startDate);
      forEachRight(newEntries, newEntry => {
        entries.splice(newEntry.position, 0, newEntry);
      });
      setDayEntries(entries);
    } else {
      setDayEntries([]);
    }
  }, [groupedTimetable, currentDate]);

  return (
    <Box
      component="span"
      sx={boxSx}
      style={{ "display": show ? "block" : "none" }}
    >
      <Header text="Timetable" visible={timetable.length > 0} />
      <TimetableHeader
        day={date}
        currentDate={currentDate}
        minDate={minDate}
        previousDay={goToPreviousDay}
        nextDay={goToNextDay}
      />
      {dayEntries.map((entry) => (
        <TimetableEntry
          entry={entry}
          key={entry.id}
        />
      ))}
    </Box>
  )
}

export default Timetable;
