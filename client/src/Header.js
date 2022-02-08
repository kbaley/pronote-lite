import { Typography } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';

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

const Header = ({text, visible, printFunction}) => {
  return (
    <>
      <Typography
        sx={titleSx}
        component="h1"
        style={{ display: visible ? "block" : "none"}}
      >
        {text}
        {printFunction &&
          <PrintIcon sx={{ml: 2}} onClick={printFunction} />
        }
      </Typography>
    </>
  );
}

export default Header;
