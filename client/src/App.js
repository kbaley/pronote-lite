import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';

function App() {
  const [data] = React.useState(null);
  const [timetable, setTimetable] = React.useState([]);
  const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME ?? "");
  const [password, setPassword] = React.useState(process.env.REACT_APP_PASSWORD ?? "");
  const [homework, setHomework] = React.useState([]);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getStudentData = () => {
    axios.get('/api/homework')
      .then( (result) => setHomework(result.data));

    axios.get('/api/timetable')
      .then( (result) => setTimetable(result.data));
  }

  const handleLoginResponse = (data) => {
    getStudentData();
  }

  const login = async () => {
    const result = await axios.post('/api/login', {username, password})
    handleLoginResponse(result);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>
          <label htmlFor="username">Username</label>
          <input name="username" id="username" value={username} onChange={handleUserNameChange}/>

        </p>
        <p>
          <label htmlFor="password">Password</label>
          <input name="password" id="password" value={password} onChange={handlePasswordChange}/>
        </p>
        <p>
          <button
            onClick={login}
          >
            Log in
          </button>
        </p>
        <p>
          {!data ? "" : "Logged in"}
        </p>
        <Timetable
          timetable={timetable}
        />

        <Homework
          homework={homework}
        />
      </header>
    </div>
  );
}

export default App;
