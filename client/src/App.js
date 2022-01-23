import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';
import LoginForm from './LoginForm';

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
      <header className="App-header">
        <LoginForm
          loginSuccess={login}
          logoutSuccess={logout}
          setTimezoneOffset={setTimezoneOffset}
        />
        <Timetable
          timetable={timetable}
          offset={timezoneOffset}
        />

        <Homework
          homework={homework}
          offset={timezoneOffset}
        />
      </header>
    </div>
  );
}

export default App;
