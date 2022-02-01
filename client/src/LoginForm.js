import React from 'react';
import './App.css';
import axios from 'axios';
import { Button, TextField, Box, Typography } from '@mui/material';

const LoginForm = ({loginSuccess, logoutSuccess, isParentLoggedIn}) => {

  const [username, setUsername] = React.useState(process.env.REACT_APP_USERNAME ?? "");
  const [password, setPassword] = React.useState(process.env.REACT_APP_PASSWORD ?? "");
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const [studentName, setStudentName] = React.useState("");

  React.useEffect(() => {
    if (!isLoggedIn) {
      axios.get('/api/checkSession')
        .then( (result) => {
          setIsLoggedIn(result.data.isLoggedIn);
          if (result.data.isLoggedIn) {
            loginSuccess();
            setStudentName(result.data.user.name);
          }
        });
    }
  }, [loginSuccess, isLoggedIn]);

  React.useEffect(() => {
    setIsLoggedIn(isParentLoggedIn);
  }, [isParentLoggedIn]);

  const handleUserNameChange = (event) => {
    setUsername(event.target.value);
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLoginResponse = (response) => {
    setStudentName(response.data.user.name);
    setIsLoggedIn(true);
    loginSuccess();
  }

  const login = async () => {
    setIsLoggingIn(true);
    const result = await axios.post('/api/login', {username, password})
    handleLoginResponse(result);
    setIsLoggingIn(false);
  }

  const logout = async () => {
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
      <>
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
      <div>{isLoggingIn ? "Logging in..." : ""}</div>
      </>
      }
      { isLoggedIn &&
      <div>
        <Typography variant="h5" 
          sx={{
            display: "inline",
            fontSize: {
              md: 24,
              xs: 18
            }
          }}
        >
          {studentName}
        </Typography>
        <Button
          variant="contained"
          onClick={logout}
          sx={{display: "inline-block", float: "right"}}
        >
          Log out
        </Button>
      </div>
      }
    </Box>
  )
}

export default LoginForm;
