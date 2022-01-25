import React from 'react';
import { Box, Card, CardActionArea, Typography } from '@mui/material';
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
    backgroundColor: `rgba(${hexToRgb(backgroundColor)}0.1)`
  })
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
  const [firstDay, setFirstDay] = React.useState([]);

  React.useEffect(() => {
    const getDateWithoutTime = (date) => {
      return moment(date).add(offset, 'minutes').format('MMM DD');
    }

    const dateToUse = new Date();
    if (dateToUse.getHours() > 14) {
      dateToUse.setDate(dateToUse.getDate() + 1);
    }
    const date = getDateWithoutTime(dateToUse);

    const filtered = filter(timetable, (entry) => getDateWithoutTime(entry.from) === date);
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
      {firstDay.map((entry) => (
        <Card
          key={entry.id}
          variant="outlined"
          sx={cardSx(entry.color)}
        >
          <CardActionArea
            sx={{p: 1}}
          >
            <Typography color="text.primary" sx={dateSx} variant="body2">
              {moment(entry.from).add(offset, 'minutes').format('MMM DD HH:mm')}
            </Typography>
            <Typography color="text.primary" sx={subjectSx} variant="body2">
              {entry.subject}
            </Typography>
            <Typography color="text.secondary" sx={teacherSx} gutterBottom variant="body2">
              {entry.teacher}
            </Typography>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  )
}

export default Timetable;
