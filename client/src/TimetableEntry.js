import { Box, Card, CardContent, Typography } from '@mui/material';
import moment from 'moment';

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

const cardSx = (backgroundColor) => {
  return (
  {
    my: 0,
    border: `0 solid ${backgroundColor}`,
    borderRadius: 0,
    p: 0,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: `rgba(${hexToRgb(backgroundColor)}0.1)`,
    display: 'flex',
  })
}

const dateSx = {
  fontSize: {
    md: 18,
    xs: 16,
  },
}

const subjectSx = {
  fontSize: {
    md: 16,
    xs: 14,
  },
}

const teacherSx = {
  fontSize: 12,
}


const TimetableEntry = ({entry}) => {

  return (
    <Card
      key={entry.id}
      variant="outlined"
      sx={cardSx(entry.color)}
    >
      <Box sx={{display: 'flex', flexDirection: 'column'}}>
        <CardContent sx={{ flex: '1 0 auto', borderRight: `1px solid ${entry.color}`,  }}>
          <Typography color="text.primary" sx={dateSx} variant="body2" component="div">
            {moment(entry.from).format('HH:mm')}
          </Typography>
        </CardContent>
      </Box>
      <CardContent sx={{width: '100%', p: 0, '&:last-child': { pb: 0 }}}>
          <Typography color="text.primary" sx={subjectSx} variant="body2" component="div">
            {entry.subject}
          </Typography>
          <Typography color="text.secondary" sx={teacherSx} variant="body2" component="div">
            {entry.teacher}
          </Typography>
      </CardContent>
    </Card>
  );
}

export default TimetableEntry;
