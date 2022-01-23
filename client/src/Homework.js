import React from 'react';
import moment from 'moment';
import { Box, Grid, Typography } from '@mui/material';
import Header from './Header';
import { groupBy } from 'lodash';
import HomeworkDay from './HomeworkDay';

const boxSx = {
  display: 'inline-block',
  mx: '5px',
}

const dateSx = {
  fontSize: 20,
  mt: 3,
  mb: 1,
  p: 1,
  backgroundColor: '#ececec'
}

const Homework  = ({homework, offset}) => {

  const grouped = groupBy(homework, 'for');
  const keys = Object.keys(grouped);

  return (
    <Box
      component="span"
      sx={boxSx}
    >
      <Header text="Homework" />
      {keys.map((key) => (
        <React.Fragment key={key}>
          <Typography component="h2" sx={dateSx}>{moment(key).add(offset, 'minutes').format('ddd, MMM DD')}</Typography>
          <HomeworkDay entries={grouped[key]} />
        </React.Fragment>
      ))}
    </Box>
  )
}

export default Homework;
