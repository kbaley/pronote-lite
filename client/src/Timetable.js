import { Box, Card, Typography } from '@mui/material';
import moment from 'moment';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
}
const cardSx = {
  my: {
    md: 1,
    xs: 0,
  },
  padding: {
    md: 1,
    xs: 0.5,
  },
  transform: {
    md: 'scale(1.0)',
    xs: 'scale(0.8)'
  }
}

const dateSx = {
  fontSize: 16,
}

const subjectSx = {
  fontSize: 18,
}

const teacherSx = {
  fontSize: 12,
}

const Timetable  = ({timetable, offset}) => {
  return (
    <Box
      component="span"
      sx={boxSx}
    >
      {timetable.map((entry) => (
        <Card
          key={entry.id}
          sx={cardSx}
          style={{ textAlign: 'center' }}
        >
          <Typography color="text.primary" sx={dateSx}>{moment(entry.from).add(offset, 'minutes').format('MMM DD HH:mm')}</Typography>
          <Typography color="text.primary" sx={subjectSx}>{entry.subject}</Typography>
          <Typography color="text.secondary" sx={teacherSx} gutterBottom>{entry.teacher}</Typography>
        </Card>
      ))}
    </Box>
  )
}

export default Timetable;
