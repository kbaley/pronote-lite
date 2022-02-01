import { Typography, Grid, Button } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const TimetableHeader = ({day, previousDay, nextDay}) => {
  return (
    <Grid container
      spacing={2}
    >
      <Grid item
        container
        xs={3}
        alignItems="center"
        justifyContent="flex-start"
      >
        <Button
          onClick={previousDay}
        >
          <KeyboardArrowLeftIcon />
        </Button>
      </Grid>
      <Grid item
        xs={6}
        alignItems="center"
      >
        <Typography variant="h6" sx={{textAlign: 'center'}}>{day}</Typography>
      </Grid>
      <Grid item
        container
        alignItems="center"
        xs={3}
        justifyContent="flex-end"
      >
        <Button
          onClick={nextDay}
        >
          <KeyboardArrowRightIcon />
        </Button>
      </Grid>
    </Grid>
  );
}

export default TimetableHeader;