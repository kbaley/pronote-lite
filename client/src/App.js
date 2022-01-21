import React from 'react';
import './App.css';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';

const defaultLoading = {
  homework: false,
  timetable: false
}

function App() {
  const [timetable, setTimetable] = React.useState([]);
  const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME ?? "");
  const [password, setPassword] = React.useState(process.env.REACT_APP_PASSWORD ?? "");
  const [homework, setHomework] = React.useState([]);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [loading, setLoading] = React.useState(defaultLoading);

  React.useEffect(() => {
    axios.get('/api/checkSession')
      .then( (result) => {
        setIsLoggedIn(result.data.isLoggedIn);
        if (result.data.isLoggedIn) {
          getStudentData();
        }
      });
  }, []);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const getStudentData = () => {
    setLoading({homework: true, timetable: true});
    axios.get('/api/homework')
      .then( (result) => {
        setHomework(result.data);
        setLoading({
          ...loading,
          homework: false
        });
      });

    axios.get('/api/timetable')
      .then( (result) => {
        setTimetable(result.data);
        console.log(loading);
        // setLoading({
          // ...loading,
          // timetable: false
        // });
      });
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
        { !isLoggedIn && 
        <React.Fragment>
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
        </React.Fragment>
        }
        <p>
          {isLoggedIn ? "Logged in" : "Not logged in"}
        </p>
        <p>
          {loading && (loading.homework === true || loading.timetable === true) ? "Loading data..." : ""}
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
