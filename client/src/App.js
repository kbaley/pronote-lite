import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';

function App() {
  const [data] = React.useState(null);
  const [timetable, setTimetable] = React.useState([]);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [homework, setHomework] = React.useState([]);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getStudentData = () => {
    fetch("/api/homework")
      .then((res) => res.json())
      .then((data) => setHomework(data));

    fetch("/api/timetable")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTimetable(data)
      });
  }

  const login = () => {
    fetch("/api/login",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
      }
    )
      .then((res) => res.json())
      .then((data) => getStudentData());
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
