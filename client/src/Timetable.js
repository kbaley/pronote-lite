import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { 
  groupBy, 
  forEachRight, 
  clone, 
  filter, 
  map,
  uniqWith,
  isEqual
} from 'lodash';
import TimetableHeader from './TimetableHeader';
import {
  getFirstDate,
  getBreaks,
  getDateWithoutTime,
  getDateAtMidnight,
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
  const [maxDate, setMaxDate] = React.useState(null);
  const [groupedTimetable, setGroupedTimetable] = React.useState([]);
  const [availableDates, setAvailableDates] = React.useState([]);
  const [currentDateIndex, setCurrentDateIndex] = React.useState(0);

  const goToPreviousDay = () => {
    if (currentDateIndex > 0) {
      setCurrentDateIndex(currentDateIndex - 1);
      setCurrentDate(availableDates[currentDateIndex - 1]);
    }
  }

  const goToNextDay = () => {
    if (currentDateIndex < availableDates.length ) {
      setCurrentDateIndex(currentDateIndex + 1);
      setCurrentDate(availableDates[currentDateIndex + 1]);
    }
  }

  React.useEffect(() => {
    const dates = uniqWith(map(timetable, (entry) => {
      return getDateAtMidnight(entry.from);
    }), isEqual);
    setAvailableDates(dates);
    const filtered = filter(timetable, (entry) => entry.status !== "Cours annulé");
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
    if (dates.length > 0) {
      setCurrentDate(dates[0]);
      setCurrentDateIndex(0);
      setMinDate(dates[0]);
      setMaxDate(dates[dates.length - 1]);
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
        maxDate={maxDate}
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
