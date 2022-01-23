import React from 'react';
import './App.css';
import axios from 'axios';
import { Button, TextField, Box } from '@mui/material';

const LoginForm = ({loginSuccess, logoutSuccess, setTimezoneOffset}) => {

  const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME ?? "");
  const [password, setPassword] = React.useState(process.env.REACT_APP_PASSWORD ?? "");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    if (!isLoggedIn) {
      axios.get('/api/checkSession')
        .then( (result) => {
          setIsLoggedIn(result.data.isLoggedIn);
          setTimezoneOffset(new Date().getTimezoneOffset() - result.data.timezoneOffset);
          if (result.data.isLoggedIn) {
            loginSuccess();
          }
        });
    }
  }, [loginSuccess, setTimezoneOffset]);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginResponse = (data) => {
    setIsLoggedIn(true);
    loginSuccess();
  }

  const login = async () => {
    const result = await axios.post('/api/login', {username, password})
    handleLoginResponse(result);
  }

  const logout = async () => {
    await axios.post('/api/logout');
    setIsLoggedIn(false);
    logoutSuccess();
  }

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete='off'
    >
      { !isLoggedIn &&
      <React.Fragment>
      <div>
        <TextField
          label="Username"
          variant="filled"
          name="username"
          value={username}
          onChange={handleUserNameChange}
        />
      </div>
      <div>
        <TextField
          label="Password"
          variant="filled"
          type="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <div>
        <Button
          variant="contained"
          onClick={login}>
          Log in
        </Button>
      </div>
      </React.Fragment>
      }
      <div>
        {isLoggedIn ? "Logged in" : "Not logged in"}
      </div>
      { isLoggedIn &&
      <div>
        <Button
          variant="contained"
          onClick={logout}>
          Log out
        </Button>
      </div>
      }
    </Box>
  )
}

export default LoginForm;
