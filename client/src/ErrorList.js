import { Alert, AlertTitle } from '@mui/material';
import React from 'react';

const ErrorList = ({errors}) => {
  return (
    <React.Fragment>
      {errors.map( (error, i) => (
        <Alert severity="error" key={i}>
          <AlertTitle>{error.description}</AlertTitle>
          {error.message}
        </Alert>
      ))}
    </React.Fragment>
  ) 
}

export default ErrorList;
