import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { groupBy, forEachRight, clone, filter } from 'lodash';
import TimetableHeader from './TimetableHeader';
import {
  getFirstDate,
  tomorrow,
  yesterday,
  getBreaks,
  getDateWithoutTime
} from './TimetableFns';
import { useNavigate } from 'react-router-dom';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
  width: '100%',
}
const Timetable  = ({timetable, show}) => {
  const [dayEntries, setDayEntries] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(getFirstDate(timetable));
  const [groupedTimetable, setGroupedTimetable] = React.useState([]);
  const navigate = useNavigate();

  const goToPreviousDay = () => {
    setCurrentDate(yesterday(currentDate));
  }

  const goToNextDay = () => {
    setCurrentDate(tomorrow(currentDate));
  }

  React.useEffect(() => {
    const filtered = filter(timetable, (entry) => entry.status !== "Cours annulé");
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
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

  const print = () => {
    navigate("/print");
  }

  return (
    <Box
      component="span"
      sx={boxSx}
      style={{ "display": show ? "block" : "none" }}
    >
      <Header
        text="Timetable"
        visible={timetable.length > 0}
        printFunction={print}
      />
      <TimetableHeader
        day={date}
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
