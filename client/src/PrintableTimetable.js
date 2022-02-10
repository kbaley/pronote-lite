import React from 'react';
import { Box } from '@mui/material';
import TimetableEntry from './TimetableEntry';
import { forEachRight, clone } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { forEach } from 'lodash';
import LoginForm from './LoginForm';
import {
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
  const [timetable, setTimetable] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const getStudentData = React.useCallback(() => {

    axios.get('/api/weeklytimetable')
    .then( (result) => {
      const data = result.data;
      moment.suppressDeprecationWarnings = true;
      forEach(data, entry => {
        entry.from = moment(entry.fromNoTimezone).toDate();
        entry.to = moment(entry.toNoTimezone).toDate();;
      });
      console.log(data);
      moment.suppressDeprecationWarnings = false;
      addBreaks(data);
      setTimetable(data);
    })
    .catch( (error) => {
      console.log(error);
    });
  }, []);

  const addBreaks = (filtered) => {
    const keys = Object.keys(filtered);
    for (let index = 0; index < keys.length; index++) {
      const day = filtered[keys[index]];
      filtered[keys[index]] = addBreaksToDay(day, keys[index]);
    }
  };

  const addBreaksToDay = (entries, date) => {
    let startDate = new Date(date);
    console.log(entries);
    startDate.setHours(7);
    startDate.setMinutes(30);
    startDate.setSeconds(0);

    const clonedEntries = clone(entries);
    const newEntries = getBreaks(entries, startDate);
    forEachRight(newEntries, newEntry => {
      clonedEntries.splice(newEntry.position, 0, newEntry);
    });
    return clonedEntries;
  }

  const login = async () => {
    getStudentData();
    setIsLoggedIn(true);
  }

  const logout = async () => {
  }

  return (
    <>
      <div className="App">
        <LoginForm
          loginSuccess={login}
          logoutSuccess={logout}
          isParentLoggedIn={isLoggedIn}
          show={!isLoggedIn}
        />
      </div>
    </>
  )
}

export default PrintableTimetable;
