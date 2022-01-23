import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Grid } from '@mui/material';

function App() {
  const [timetable, setTimetable] = React.useState([]);
  const [homework, setHomework] = React.useState([]);
  const [timezoneOffset, setTimezoneOffset] = React.useState(0);
  
  const getStudentData = React.useCallback(() => {
    axios.get('/api/homework')
      .then( (result) => {
        setHomework(result.data);
      });

    axios.get('/api/timetable')
      .then( (result) => {
        setTimetable(result.data);
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
          <Timetable
            timetable={timetable}
            offset={timezoneOffset}
          />
        </Grid>
        <Grid item
          md={10}
          xs={12}
        >
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
