import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import moment from 'moment';
import { pickBy } from 'lodash';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
  width: '100%',
}

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

const calculateSlotSize = (slotSize) => {
  if (!slotSize) return 60;
  if (typeof(slotSize) === 'object') return 60;
  if (slotSize === 0) return 60;
  return slotSize * 60 + ((slotSize - 1));
}

const slotSx = (slotSize, backgroundColor) => ({
  height: calculateSlotSize(slotSize),
  display: 'flex',
  marginTop: '-1px',
  marginLeft: '-1px',
  justifyContent: 'center',
  flexDirection: 'column',
  textAlign: 'center',
  backgroundColor: `rgba(${hexToRgb(backgroundColor)}0.1)`,
});

const DayEntry = ({day, entries}) => {
  const date = moment(day).format('yyyy-MM-DD');
  if (!entries[date]) {
    return (
      <Grid item xs={2}><span></span></Grid>
    )
  }
  return (
    <Grid item xs={2}>
      {entries[date].map((classItem, i) => (
        <Paper
          variant="outlined"
          sx={slotSx(classItem.slots, classItem.color)}
          square
          key={i}
        >
          {classItem.subject}
        </Paper>
      ))}
    </Grid>
  )
}

const WeeklyTimetable  = ({timetable, show}) => {
  return (
    <Box
      component="span"
      sx={boxSx}
      style={{ "display": show ? "block" : "none" }}
    >
      <Grid container spacing={0} columns={11}>
        <Grid item xs={1}></Grid>
        {timetable.days.map((entry, i) => (
          <Grid item xs={2} key={i}>
            <Box
              component="div"
              sx={{textAlign: 'center', pb: 1, fontWeight: 600}}
            >
              {moment(entry).format("MMM D")}
            </Box>
          </Grid>
        ))}
        <Grid item xs={1}>
          <Stack spacing={0}>
        {timetable.slots.map((slot, i) => (
          <Paper
            variant="outlined"
            sx={slotSx(1, '#fff')}
            square
            key={i}
          >
            {slot}
          </Paper>
        ))}
          </Stack>
        </Grid>
        {timetable.days.map((day, i) => (
          <DayEntry
            day={day}
            entries={pickBy(timetable.timetable, (_, key) => {
              return (key === moment(day).format('yyyy-MM-DD'));
            })}
            key={i}
          />
        ))}
      </Grid>
    </Box>
  )
}

export default WeeklyTimetable;
