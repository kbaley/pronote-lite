import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Grid, Typography } from '@mui/material';

function App() {
  const [timetable, setTimetable] = React.useState([]);
  const [homework, setHomework] = React.useState([]);
  const [timezoneOffset, setTimezoneOffset] = React.useState(0);
  const [isTimetableLoading, setIsTimetableLoading] = React.useState(false);
  const [isHomeworkLoading, setIsHomeworkLoading] = React.useState(false);

  const getStudentData = React.useCallback(() => {
    setIsTimetableLoading(true);
    setIsHomeworkLoading(true);

    axios.get('/api/timetable')
      .then( (result) => {
        setTimetable(result.data);
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
        setTimezoneOffset={setTimezoneOffset}
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
            offset={timezoneOffset}
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
            offset={timezoneOffset}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
