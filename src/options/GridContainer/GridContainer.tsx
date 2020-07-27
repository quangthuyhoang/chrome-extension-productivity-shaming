import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
  }),
);

function GridContainer ({children, ...props}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container>
        { children }
      </Grid>
    </div>
  )
}

export default GridContainer;