import { Grid, Typography } from "@mui/material"
import React from "react"

const subjectSx = {
  fontWeight: 600,
  mt: {
    md: 0,
    xs: 1,
  },
  px: 1,
  fontSize: 14,
}

const cardSx = {
  px: 1,
}

const doneSx = {
  backgroundColor: '#eef6ee',
  pb: 1,
}

const HomeworkDay = ({entries}) => {
  return (
    <Grid container
      columnSpacing={0}
      rowSpacing={2}
    >
      {entries.map( (entry) => (
        <React.Fragment key={entry.id}>
          <Grid item
            md={2}
            xs={12}
            sx={entry.done ? doneSx : null}
          >
            <Typography component="h2" sx={subjectSx}>{entry.subject}</Typography>
          </Grid>
          <Grid item
            md={9}
            xs={12}
            sx={entry.done ? doneSx : null}
          >
            <Typography component="div" sx={cardSx} variant="body2">{entry.description}</Typography>
          </Grid>
          <Grid item
            md={1}
            xs={12}
          >
            <Typography component="div" sx={cardSx} variant="body2">
            {entry.files.map( (file, i ) => (
              <div key={file.id}>
                <a href={file.url} target="_blank" rel="noreferrer">File {i+1}</a>
              </div>
            ))}
            </Typography>
          </Grid>
        </React.Fragment>
      ))}
    </Grid>
  ) 
}

export default HomeworkDay
