import React from 'react';
import { Grid, Typography } from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { forEach } from 'lodash';
import LoginForm from './LoginForm';
import WeeklyTimetable from './WeeklyTimetable';

const PrintableTimetable  = () => {
  const [timetable, setTimetable] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const getStudentData = React.useCallback(() => {

    setIsLoading(true);
    axios.get('/api/weeklytimetable')
    .then( (result) => {
      const data = result.data;
      moment.suppressDeprecationWarnings = true;
      forEach(data, entry => {
        entry.from = moment(entry.fromNoTimezone).toDate();
        entry.to = moment(entry.toNoTimezone).toDate();;
      });
      moment.suppressDeprecationWarnings = false;
      setTimetable(data);
      setIsLoading(false);
    })
    .catch( (error) => {
      console.log(error);
      setIsLoading(false);
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
        <Grid
          container
          spacing={2}
        >
          <Grid item
            xs={12}
          >
            <Typography
              sx={{display: isLoading ? "block" : "none" }}
            >
              Loading timetable...
            </Typography>
            {timetable.timetable &&
            <WeeklyTimetable
              timetable={timetable}
              show={!isLoading && isLoggedIn}
            />
            }
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default PrintableTimetable;
