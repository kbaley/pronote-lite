import { Typography } from '@mui/material';

const titleSx = {
  mt: 1,
  py: {
    md: 2,
    xs: 1,
  },
  pl: 2,
  fontSize: 20,
  backgroundColor: '#ddd',
}

const Header = ({text, visible}) => {
  return (
    <Typography
      sx={titleSx}
      component="h1"
      style={{ display: visible ? "block" : "none"}}
    >
      {text}
    </Typography>
  );
}

export default Header;
