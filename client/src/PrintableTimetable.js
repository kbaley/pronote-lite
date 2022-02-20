import React from 'react';
import { Box } from '@mui/material';
import TimetableEntry from './TimetableEntry';
import { forEachRight, clone } from 'lodash';
import axios from 'axios';
import moment from 'moment';
import { forEach } from 'lodash';
import LoginForm from './LoginForm';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
  width: '100%',
}
const PrintableTimetable  = () => {
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
      setTimetable(data);
    })
    .catch( (error) => {
      console.log(error);
    });
  }, []);

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
