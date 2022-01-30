import { Alert, AlertTitle } from '@mui/material';

const ErrorList = ({errors}) => {
  return (
    <>
      {errors.map( (error, i) => (
        <Alert severity="error" key={i}>
          <AlertTitle>{error.description}</AlertTitle>
          {error.message}
        </Alert>
      ))}
    </>
  ) 
}

export default ErrorList;
