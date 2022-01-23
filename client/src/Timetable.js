import { Box, Card, Typography } from '@mui/material';
import moment from 'moment';

const Timetable  = ({timetable, offset}) => {
  return (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '5px' }}
    >
      {timetable.map((entry) => (
        <Card
          key={entry.id}
          sx={{ my: '10px', padding: '5px' }}
          style={{ textAlign: 'center' }}
        >
          <Typography color="text.primary" gutterBottom>{moment(entry.from).add(offset, 'minutes').format('MMM DD HH:mm')}</Typography>
          <Typography color="text.primary" gutterBottom>{entry.subject}</Typography>
          <Typography color="text.secondary" style={{ fontSize: 12 }} gutterBottom>{entry.teacher}</Typography>
        </Card>
      ))}
    </Box>
  )
}

export default Timetable;
