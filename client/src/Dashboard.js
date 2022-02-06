import React from 'react';
import Timetable from './Timetable';
import Homework from './Homework';
import axios from 'axios';
import LoginForm from './LoginForm';
import { Grid, Typography } from '@mui/material';
import { forEach } from 'lodash';
import moment from 'moment';
import ErrorList from './ErrorList';

const Dashboard = () => {
  const [timetable, setTimetable] = React.useState([]);
  const [homework, setHomework] = React.useState([]);
  const [isTimetableLoading, setIsTimetableLoading] = React.useState(false);
  const [isHomeworkLoading, setIsHomeworkLoading] = React.useState(false);
  const [errors, dispatch] = React.useReducer(reducer, []);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  const getStudentData = React.useCallback(() => {
    setIsTimetableLoading(true);
    setIsHomeworkLoading(true);
    dispatch({type: "clear"});
    const cancelToken = axios.CancelToken;
    const source = cancelToken.source();

    axios.get('/api/timetable', {
      cancelToken: source.token
    }).then( (result) => {
        const data = result.data;
        moment.suppressDeprecationWarnings = true;
        forEach(data, entry => {
          entry.from = moment(entry.fromNoTimezone).toDate();
          entry.to = moment(entry.toNoTimezone).toDate();;
        });
        moment.suppressDeprecationWarnings = false;
        setTimetable(data);
        setIsTimetableLoading(false);
      })
      .catch( (error) => {
        if (axios.isCancel(error)) return;
        if (error.response.status === 401) {
          setIsHomeworkLoading(false);
          setIsTimetableLoading(false);
          source.cancel("Session has been canceled");
          logout();
        } else {
          error.description = "Error loading timetable";
          dispatch({type: "add", error});
          setIsTimetableLoading(false);
        }
      });

    axios.get('/api/homework', {
      cancelToken: source.token
    }).then( (result) => {
        const data = result.data;
        moment.suppressDeprecationWarnings = true;
        forEach(data, entry => {
          entry.for = moment(entry.forNoTimezone).toDate();
        });
        moment.suppressDeprecationWarnings = false;
        setHomework(result.data);
        setIsHomeworkLoading(false);
      })
      .catch( (error) => {
        if (axios.isCancel(error)) return;
        if (error.response.status === 401) {
          setIsHomeworkLoading(false);
          setIsTimetableLoading(false);
          source.cancel("Session has been canceled");
          logout();
        } else {
          error.description = "Error loading homework";
          dispatch({type: "add", error});
          setIsHomeworkLoading(false);
        }
      });

  }, []);

  const login = () => {
    getStudentData();
    setIsLoggedIn(true);
  }

  const logout = async () => {
    await axios.post('/api/logout');
    setHomework([]);
    setTimetable([]);
    setIsLoggedIn(false);
  }

  return (
    <>
      <div className="App">
        <LoginForm
          loginSuccess={login}
          logoutSuccess={logout}
          isParentLoggedIn={isLoggedIn}
        />
        <Grid
          container
          spacing={2}
        >
          <Grid item
            xs={12}
          >
            <ErrorList errors={errors} />
          </Grid>
          <Grid item
            lg={3}
            md={4}
            xs={12}
          >
            <Typography
              sx={{display: isTimetableLoading ? "block" : "none" }}
            >
              Loading timetable...
            </Typography>
            <Timetable
              timetable={timetable}
              show={!isTimetableLoading && isLoggedIn}
            />
          </Grid>
          <Grid item
            lg={9}
            md={8}
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
    </>
  );
}


function reducer(state, action) {
  switch (action.type) {
    case "clear":
      return [];
    case "add":
      return [...state, action.error];
    default:
      throw new Error();
  }
}


export default Dashboard
