import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Grid, Typography } from '@mui/material';
import { forEach, filter } from 'lodash';
import moment from 'moment';

function App() {
  const [timetable, setTimetable] = React.useState([]);
  const [homework, setHomework] = React.useState([]);
  const [isTimetableLoading, setIsTimetableLoading] = React.useState(false);
  const [isHomeworkLoading, setIsHomeworkLoading] = React.useState(false);

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

  const getStudentData = React.useCallback(() => {
    setIsTimetableLoading(true);
    setIsHomeworkLoading(true);

    axios.get('/api/timetable')
      .then( (result) => {
        const defaultDate = getDefaultDate();
        const data = filter(result.data, (entry) => new Date(entry.from) >= defaultDate);
        moment.suppressDeprecationWarnings = true;
        forEach(data, entry => {
          entry.from = moment(entry.fromNoTimezone).toDate();
          entry.to = moment(entry.toNoTimezone).toDate();;
        });
        moment.suppressDeprecationWarnings = false;
        setTimetable(data);
        setIsTimetableLoading(false);
      });

    axios.get('/api/homework')
      .then( (result) => {
        setHomework(result.data);
        setIsHomeworkLoading(false);
      });

  }, []);

  const login = () => {
    getStudentData();
  }

  const logout = () => {
    setHomework([]);
    setTimetable([]);
  }

  return (
    <div className="App">
      <LoginForm
        loginSuccess={login}
        logoutSuccess={logout}
      />
      <Grid
        container
        spacing={2}
      >
        <Grid item
          md={2}
          xs={12}
        >
          <Typography
            sx={{display: isTimetableLoading ? "block" : "none" }}
          >
            Loading timetable...
          </Typography>
          <Timetable
            timetable={timetable}
          />
        </Grid>
        <Grid item
          md={10}
          xs={12}
        >
          <Typography
            sx={{display: isHomeworkLoading ? "block" : "none" }}
          >
            Loading homework...
          </Typography>
          <Homework
            homework={homework}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
