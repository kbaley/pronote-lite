import React from 'react';
import { Box, Card, CardContent, CardActionArea, Typography } from '@mui/material';
import moment from 'moment';
import Header from './Header';
import { groupBy, filter } from 'lodash';

const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const json = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  if (json) {
    return `${json.r}, ${json.g}, ${json.b}, `;
  }
}

const boxSx = {
  display: 'inline-block',
  mx: '5px',
}
const cardSx = (backgroundColor) => {
  return (
  {
    my: 0,
    border: `0 solid ${backgroundColor}`,
    borderRadius: 0,
    padding: {
      md: 0,
      xs: 0.5,
    },
    transform: {
      md: 'scale(1.0)',
      xs: 'scale(0.8)'
    },
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(${hexToRgb(backgroundColor)}0.1)`,
    display: 'flex',
  })
}

const dateSx = {
  fontSize: 18,
}

const subjectSx = {
  fontSize: 16,
}

const teacherSx = {
  fontSize: 12,
}

const Timetable  = ({timetable, offset}) => {
  const [firstDay, setFirstDay] = React.useState([]);
  const [date, setDate] = React.useState("");

  React.useEffect(() => {
    const getDateWithoutTime = (date) => {
      return moment(date).add(offset, 'minutes').format('MMM DD');
    }

    const dateToUse = new Date();
    if (dateToUse.getHours() > 14) {
      dateToUse.setDate(dateToUse.getDate() + 1);
    }
    const dateFormatted = getDateWithoutTime(dateToUse);
    setDate(dateFormatted);

    const filtered = filter(timetable, (entry) => getDateWithoutTime(entry.from) === dateFormatted);
    const grouped = groupBy(filtered, (entry) => getDateWithoutTime(entry.from));
    const keys = Object.keys(grouped);
    setFirstDay(timetable.length > 0 ? grouped[keys[0]] : []);
  }, [timetable, offset]);

  return (
    <Box
      component="span"
      sx={boxSx}
    >
      <Header text="Timetable" visible={timetable.length > 0} />
      <Typography variant="h6" sx={{textAlign: 'center'}}>{firstDay.length > 0 ? date : ""}</Typography>
      {firstDay.map((entry) => (
        <Card
          key={entry.id}
          variant="outlined"
          sx={cardSx(entry.color)}
        >
          <Box sx={{display: 'flex', flexDirection: 'column'}}>
            <CardContent sx={{ flex: '1 0 auto' }}>
              <Typography color="text.primary" sx={dateSx} variant="body2" component="div">
                {moment(entry.from).add(offset, 'minutes').format('HH:mm')}
              </Typography>
            </CardContent>
          </Box>
          <CardContent sx={{width: '100%', borderLeft: `1px solid ${entry.color}`}}>
              <Typography color="text.primary" sx={subjectSx} variant="body2" component="div">
                {entry.subject}
              </Typography>
              <Typography color="text.secondary" sx={teacherSx} variant="body2" component="div">
                {entry.teacher}
              </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  )
}

export default Timetable;
