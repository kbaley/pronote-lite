import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';

function App() {
  const [timetable, setTimetable] = React.useState([]);
  const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME ?? "");
  const [password, setPassword] = React.useState(process.env.REACT_APP_PASSWORD ?? "");
  const [homework, setHomework] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [timezoneOffset, setTimezoneOffset] = React.useState(0);
  const serverTimezoneOffset = new Date().getTimezoneOffset();
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

  React.useEffect(() => {
    axios.get('/api/checkSession')
      .then( (result) => {
        setIsLoggedIn(result.data.isLoggedIn);
        setTimezoneOffset(new Date().getTimezoneOffset() - result.data.timezoneOffset);
        if (result.data.isLoggedIn) {
          getStudentData();
        }
      });
  }, [getStudentData]);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginResponse = (data) => {
    setIsLoggedIn(true);
    getStudentData();
  }

  const login = async () => {
    const result = await axios.post('/api/login', {username, password})
    handleLoginResponse(result);
  }

  const logout = async () => {
    await axios.post('/api/logout');
    setIsLoggedIn(false);
    setHomework([]);
    setTimetable([]);
  }

  return (
    <div className="App">
      <header className="App-header">
        { !isLoggedIn && 
        <React.Fragment>
        <p>
          <label htmlFor="username">Username</label>
          <input name="username" id="username" value={username} onChange={handleUserNameChange}/>

        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" value={password} onChange={handlePasswordChange}/>
        </p>
        <p>
          <button
            onClick={login}
          >
            Log in
          </button>
        </p>
        </React.Fragment>
        }
        <p>
          {isLoggedIn ? "Logged in" : "Not logged in"}
        </p>
        { isLoggedIn &&
        <p>
          <button onClick={logout}>Log out</button>
        </p>
        }
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
