import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import TimetableEntry from './TimetableEntry';
import { groupBy, forEachRight, clone, filter } from 'lodash';
import axios from 'axios';
import {
  getFirstDate,
  getBreaks,
  getDateWithoutTime
} from './TimetableFns';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
  width: '100%',
}
const PrintableTimetable  = () => {
  const [dayEntries, setDayEntries] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [currentDate, setCurrentDate] = React.useState(getFirstDate(timetable));
  const [groupedTimetable, setGroupedTimetable] = React.useState([]);
  const [timetable, setTimetable] = React.useState([]);

  const getStudentData = React.useCallback(() => {
    setIsTimetableLoading(true);
    dispatch({type: "clear"});
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    axios.get('/api/timetable', {
      cancelToken: source.token
    }).then( (result) => {
        const data = result.data;
        moment.suppressDeprecationWarnings = true;
        forEach(data, entry => {
          entry.from = moment(entry.fromNoTimezone).toDate();
          entry.to = moment(entry.toNoTimezone).toDate();;
        });
        moment.suppressDeprecationWarnings = false;
        setTimetable(data);
        setIsTimetableLoading(false);
      })
      .catch( (error) => {
        if (axios.isCancel(error)) return;
        if (error.response.status === 401) {
          setIsTimetableLoading(false);
          source.cancel("Session has been canceled");
          logout();
        } else {
          error.description = "Error loading timetable";
          dispatch({type: "add", error});
          setIsTimetableLoading(false);
        }
      });

  }, []);

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

  return (
    <Box
      component="span"
      sx={boxSx}
    >
      <Header text="Timetable" visible={timetable.length > 0} />
      {dayEntries.map((entry) => (
        <TimetableEntry
          entry={entry}
          key={entry.id}
        />
      ))}
    </Box>
  )
}

export default PrintableTimetable;
