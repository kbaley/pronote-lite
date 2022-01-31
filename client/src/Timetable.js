import React from 'react';
import { Box } from '@mui/material';
import moment from 'moment';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { groupBy, forEachRight, clone, filter } from 'lodash';
import TimetableHeader from './TimetableHeader';
import { getFirstDate, tomorrow, yesterday, getBreaks } from './TimetableFns';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
}
const Timetable  = ({timetable}) => {
  const [firstDay, setFirstDay] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(getFirstDate(timetable));
  const [groupedTimetable, setGroupedTimetable] = React.useState([]);

  const goToPreviousDay = () => {
    setCurrentDate(yesterday(currentDate));
  }

  const goToNextDay = () => {
    setCurrentDate(tomorrow(currentDate));
  }

  React.useEffect(() => {
    const getDateWithoutTime = (date) => {
      return moment(date).format('MMM DD');
    }

    const dateToUse = timetable.length > 0 ? currentDate : new Date();
    let startDate = new Date(dateToUse);
    startDate.setHours(7);
    startDate.setMinutes(30);
    startDate.setSeconds(0);
    const dateFormatted = getDateWithoutTime(dateToUse);
    setDate(dateFormatted);

    const filtered = filter(timetable, (entry) => entry.status !== "Cours annulé");
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
    setGroupedTimetable(grouped);
    const keys = Object.keys(grouped);
    const selectedKey = keys.find(k => k === dateFormatted);
    if (timetable.length > 0 && selectedKey) {
      const dayEntries = clone(grouped[selectedKey]);
      const newEntries = getBreaks(dayEntries, startDate);
      forEachRight(newEntries, newEntry => {
        dayEntries.splice(newEntry.position, 0, newEntry);
      });
      setFirstDay(dayEntries);
    } else {
      setFirstDay([]);
    }
  }, [timetable, currentDate]);

  return (
    <Box
      component="span"
      sx={boxSx}
    >
      <Header text="Timetable" visible={timetable.length > 0} />
      <TimetableHeader 
        day={firstDay.length > 0 ? date : ""} 
        previousDay={goToPreviousDay}
        nextDay={goToNextDay}
      />
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
